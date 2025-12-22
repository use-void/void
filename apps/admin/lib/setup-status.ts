// apps/admin/lib/setup-status.ts

import { is_initialized } from "@void/db";
import { unstable_noStore as noStore } from "next/cache";

export async function checkSetupStatus(): Promise<boolean> {
    // 1. هذا السطر يحل مشكلة "used Date.now()"
    // يخبر Next.js أن هذه الدالة ديناميكية ولا يجب تجميدها وقت البناء
    noStore();

    try {
        // ننتظر الاتصال ونتيجة الاستعلام
        return await is_initialized();
    } catch (error) {
        // في حال فشل الاتصال (Timeout)، نعتبر النظام غير مثبت لنعرض المعالج بدلاً من تحطيم التطبيق
        console.error("⚠️ Failed to check setup status:", error);
        return false;
    }
}