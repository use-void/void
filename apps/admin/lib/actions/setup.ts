"use server";

import { auth } from "@void/auth";
import { headers, cookies } from "next/headers";
// تأكد أن @void/db يصدر هذه العناصر بشكل صحيح في index.ts
import { 
  connectDB, 
  User, 
  StoreConfig, 
  is_initialized, 
  mark_initialized 
} from "@void/db"; 
import { seedDatabase } from "../seed";

// تعريف نوع الاستجابة لضمان Type Safety في الواجهة الأمامية
export type SetupResponse = {
  error?: string;
  success?: boolean;
  redirectUrl?: string;
};

export async function initializeStore(formData: FormData): Promise<SetupResponse> {
  // 1. استخراج البيانات
  const storeName = formData.get("storeName") as string;
  const storeDescription = formData.get("storeDescription") as string;
  const storeLogo = formData.get("storeLogo") as string; 

  const country = formData.get("country") as string;
  const city = formData.get("city") as string;
  const address = formData.get("address") as string;
  const storePhone = formData.get("storePhone") as string; 
  const timezone = formData.get("timezone") as string;
  const currency = formData.get("currency") as string;

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const adminEmail = formData.get("email") as string;
  const adminMobile = formData.get("mobile") as string; 
  const password = formData.get("password") as string;

  const shouldSeed = formData.get("shouldSeed") === "true";

  // 2. التحقق مما إذا كان المتجر مهيأ مسبقاً
  try {
    const alreadyInitialized = await is_initialized();
    if (alreadyInitialized) {
      return { error: "Store already initialized" };
    }
  } catch (error) {
    console.error("Failed to check initialization status:", error);
    // نستمر في حال فشل التحقق (قد يكون أول تشغيل لقاعدة البيانات)
  }

  try {
    // التأكد من الاتصال بقاعدة البيانات
    await connectDB();

    // 3. إنشاء المستخدم المدير (باستخدام Better Auth)
    const headerList = await headers();
    const fullName = `${firstName} ${lastName}`.trim();

    try {
      await auth.api.signUpEmail({
        body: {
          name: fullName,
          email: adminEmail,
          password: password,
        },
        headers: headerList,
      });
    } catch (authError: any) {
      // إذا كان المستخدم موجوداً بالفعل، نتحقق مما إذا كان يمكننا المتابعة
      // (قد يكون خطأ API لكن المستخدم تم إنشاؤه)
      console.warn("Auth sign up warning:", authError?.message || authError);
    }

    // 3.5 ترقية المستخدم ليكون Admin يدوياً وتحديث بياناته الإضافية
    // نستخدم updateOne لتعديل المستخدم الذي تم إنشاؤه للتو
    await User.updateOne(
      { email: adminEmail },
      {
        $set: {
          role: "admin",
          phone: adminMobile,
          emailVerified: true, // نعتبر المدير الأول موثقاً
        },
      }
    );

    // 4. حفظ إعدادات المتجر ووضع علامة التهيئة
    
    // أ: حفظ إعدادات المتجر في StoreConfig Model
    await StoreConfig.updateOne(
      {}, 
      {
        storeName,
        description: storeDescription,
        logo: storeLogo,
        currency,
        phone: storePhone,
        timezone,
        location: {
          country,
          city,
          address,
        },
        isSetupCompleted: true,
      },
      { upsert: true }
    );

    // ب: وضع علامة على النظام (System Flag)
    await mark_initialized({
      storeSummary: {
        name: storeName,
        adminEmail: adminEmail,
        setupDate: new Date(),
      }
    });

    // 5. زرع البيانات الأولية (Seeding)
    if (shouldSeed) {
      try {
        await seedDatabase();
      } catch (seedError) {
        console.error("Seeding failed:", seedError);
        // لا نوقف العملية إذا فشل الـ seed، فقط نسجل الخطأ
      }
    }

  } catch (e) {
    console.error("Setup critical failure:", e);
    return { error: e instanceof Error ? e.message : "Setup failed. Check server logs." };
  }

  // وضع ملف تعريف ارتباط (Cookie) قصير المدى لعرض رسالة النجاح
  const cookieStore = await cookies();
  cookieStore.set("setup_complete", "true", { maxAge: 10 });

  const redirectUrl = `/`;

  return { success: true, redirectUrl };
}