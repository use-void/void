// apps/admin/lib/dal.ts
import 'server-only';
import { getSession } from "@void/auth";
import { can, type entity, type action } from "@void/auth";
import { redirect } from "next/navigation";
import { getLocale } from "@repo/i18n";

export const verifySession = async (ent: entity, act: action) => {
    const session = await getSession();
    const locale = await getLocale();

    if (!session) {
        redirect(`/${locale}/login`);
    }

    // التحقق من الصلاحيات
    if (!can(session.user.role as any, ent, act)) {
        // يمكنك توجيهه لصفحة 403 أو إرجاع خطأ
        redirect(`/${locale}/forbidden`);
    }

    return session;
};