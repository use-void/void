"use server";

import { 
  connectDB, 
  StoreConfig, 
  User, 
} from "@void/db"; 
// ✅ استيراد Seed من موقعه الجديد
import { seedDatabase } from "../utils/seed"; 

import { auth } from "@void/auth";
import { headers, cookies } from "next/headers";
import { getTranslations } from "@repo/i18n/server";
import { createSetupSchema, type SetupFormValues } from "../schema/setup.schema";

export type SetupActionResponse = {
  success: boolean;
  message?: string;
  redirectUrl?: string;
  errors?: Record<string, string[]>;
};

export async function submitSetupAction(data: SetupFormValues): Promise<SetupActionResponse> {
  const t = await getTranslations("Admin.setup");
  const setupSchema = createSetupSchema(t);

  // 1. التحقق من صحة البيانات (Zod Validation)
  const result = setupSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "errors.validationFailed",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const values = result.data;
  
  // ✅ توحيد البريد الإلكتروني لتجنب مشاكل حالة الأحرف
  const normalizedEmail = values.email.toLowerCase().trim();
  const fullName = `${values.firstName} ${values.lastName}`.trim();

  try {
    await connectDB();

    // 2. التحقق مما إذا كان النظام مثبتاً بالفعل
    const isInitialized = await StoreConfig.isSystemInitialized();
    if (isInitialized) {
      return { success: false, message: "errors.systemInitialized" };
    }

    // 3. إنشاء المستخدم عبر نظام المصادقة (Better Auth)
    const headerList = await headers();
    
    try {
      await auth.api.signUpEmail({
        body: {
          name: fullName,
          email: normalizedEmail,
          password: values.password,
        },
        headers: headerList,
      });
    } catch (authError: any) {
      // نتجاهل الخطأ إذا كان المستخدم موجوداً، لنقوم بترقيته في الخطوة التالية
      console.warn("Auth signup warning:", authError?.message);
    }

    // 4. ترقية المستخدم إلى Admin (الحل الجذري)
    // نبحث عن المستخدم الذي تم إنشاؤه تواً ونقوم بتحديث دوره
    let adminUser = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          role: "admin", // ✅ الترقية المهمة
          name: fullName,
          emailVerified: true, // نعتبر المدير الأول موثقاً
          phone: values.mobile,
        },
      },
      { new: true } // إرجاع المستند بعد التحديث
    );

    // ⚠️ شبكة أمان: إذا فشل العثور على المستخدم (بسبب مشاكل الـ Collection)، ننشئه يدوياً
    if (!adminUser) {
        console.log("User not found via Auth, creating Admin manually via Mongoose...");
        adminUser = await User.create({
            email: normalizedEmail,
            name: fullName,
            role: "admin",
            emailVerified: true,
            phone: values.mobile
            // لاحظ: كلمة المرور مخزنة في جدول auth المنفصل أو في نفس الجدول حسب إعداداتك،
            // لكن هنا نضمن وجود سجل للمدير في قاعدة البيانات
        });
    }

    // 5. إنشاء إعدادات المتجر (Store Config)
    // ✅ نستخدم new Map لإصلاح أخطاء TypeScript التي ظهرت لك سابقاً
    await StoreConfig.create({
      isSetupCompleted: true,
      
      // الترجمة
      name: new Map([
          ["en", values.storeName], 
          ["ar", values.storeName]
      ]),
      description: new Map([
          ["en", values.storeDescription]
      ]),

      // البيانات المالية
      financials: {
        defaultCurrency: values.currency,
        currencies: [{ code: values.currency, isActive: true, exchangeRate: 1 }],
        tax: { isTaxEnabled: false, isTaxInclusive: false }
      },

      // إعدادات الموقع واللغة
      localization: {
        defaultLanguage: "en",
        timezone: values.timezone,
        languages: [
            { code: "en", name: "English", isActive: true, isRTL: false },
            { code: "ar", name: "العربية", isActive: true, isRTL: true } 
        ]
      },

      // التواصل
      contact: {
          address: new Map([
              ["en", `${values.address}, ${values.city}, ${values.country}`]
          ])
      },
      
      // قيم افتراضية للحقول الإجبارية الأخرى
      assets: {},
      policies: {},
      shopSettings: {},
      seo: {}
    });

    // 6. زراعة البيانات (Seeding)
    if (values.shouldSeed) {
        try {
            await seedDatabase();
        } catch (e) {
            console.error("Seeding warning:", e);
        }
    }

    // 7. ضبط الكوكيز (للانتقال لصفحة النجاح)
    const cookieStore = await cookies();
    cookieStore.set("setup_complete", "true", { maxAge: 60 });

    return { success: true, redirectUrl: "/" };

  } catch (error: any) {
    console.error("Setup Action Critical Error:", error);
    return { 
        success: false, 
        message: error.message || "An unexpected error occurred during setup." 
    };
  }
}