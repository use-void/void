import { Suspense } from "react";
import { LanguageSwitcher } from "@repo/ui";
import { setRequestLocale } from "next-intl/server";
import { checkSetupStatus } from "../../../lib/setup-status";
import { redirect } from "next/navigation";

/**
 * مكون الـ Guard:
 * هذا المكون هو الذي سيقوم بالاتصال بقاعدة البيانات.
 * بوضعه داخل Suspense، لن ينهار الـ Build.
 */
async function SetupGuard({ locale }: { locale: string }) {
    const isSetup = await checkSetupStatus();
    if (!isSetup) {
        redirect(`/${locale}/setup`);
    }
    return null; // لا يحتاج لعرض أي شيء، وظيفته التحقق فقط
}

export default async function AuthLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="relative min-h-screen w-full bg-background">
            {/* 
                لف الـ Guard بـ Suspense هو "السر" لحل المشكلة.
                هذا يخبر Next.js: "لا تنتظر قاعدة البيانات لتصيير الـ Layout، 
                قم بالتصيير وعندما تجهز البيانات، نفذ الـ Guard".
            */}
            <Suspense fallback={null}>
                <SetupGuard locale={locale} />
            </Suspense>

            <div className="absolute top-4 end-4 z-50 md:top-8 md:end-8">
                <LanguageSwitcher variant="admin" />
            </div>

            {children}
        </div>
    );
}