import mongoose, { Schema } from "mongoose";
import { connectDB } from "./connection";
import { connection } from "next/server"; // ✅ الإضافة الجوهرية لـ Next.js 15/16

// تعريف موديل إعدادات النظام
const SystemSettingsSchema = new Schema(
    {
        _id: { type: String, required: true },
        initialized: { type: Boolean, default: false },
        store: { type: Schema.Types.Mixed },
    },
    { 
        // سنبقي على timestamps إذا كنت تحتاجها، 
        // فدالة connection() بالأسفل ستحمينا من خطأ Date.now()
        timestamps: true, 
        _id: false 
    }
);

const SystemSettings = mongoose.models.SystemSettings || mongoose.model("SystemSettings", SystemSettingsSchema);

/**
 * التحقق من حالة إعداد المتجر
 * متوافق مع Next.js 15/16 Prerendering
 */
export async function is_initialized(): Promise<boolean> {
    try {
        /**
         * 1. حماية الـ Prerendering (Next.js 15/16 Way):
         * استدعاء connection() يخبر المحرك أن هذا الكود "ديناميكي" ومرتبط بالطلب.
         * هذا يمنع خطأ "used Date.now() before accessing request data" أثناء الـ Build.
         */
        await connection();

        // 2. الاتصال الموحد بقاعدة البيانات
        await connectDB();

        // 3. تنفيذ الاستعلام
        // ملاحظة: تأكد أن الـ _id في قاعدة البيانات هو "storeconfigs" كما هو مستخدم هنا
        const doc = await SystemSettings.findById("storeconfigs").lean().exec() as { initialized?: boolean } | null;
        
        return !!doc?.initialized;
    } catch (e) {
        // طباعة الخطأ فقط في بيئة التطوير
        if (process.env.NODE_ENV !== "production") {
            console.error("💥 Error in is_initialized:", e);
        }
        // نعيد false لضمان عدم توقف التطبيق، ولتوجيه المستخدم لصفحة الإعداد (Setup)
        return false;
    }
}

/**
 * وسم المتجر كـ "مكتمل الإعداد"
 * يتم استدعاؤها عادةً في Server Action أو API Route
 */
export async function mark_initialized(payload: Record<string, unknown>) {
    try {
        await connectDB();
        
        // تحديث أو إنشاء سجل الإعدادات
        await SystemSettings.findByIdAndUpdate(
            "storeconfigs",
            { 
                $set: { 
                    ...payload, 
                    initialized: true 
                } 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        console.log("🚀 Store marked as initialized.");
    } catch (e) {
        console.error("💥 Error in mark_initialized:", e);
        throw e;
    }
}