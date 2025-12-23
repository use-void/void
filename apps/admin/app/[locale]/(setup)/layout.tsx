import { StoreConfig, connectDB } from "@void/db"; 
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setRequestLocale } from "@repo/i18n";
import { connection } from "next/server"; 
import { LanguageSwitcher } from "@repo/ui";
import { Suspense } from "react";

// ✅ 1. نقلنا المنطق الثقيل إلى مكون منفصل (Async Component)
async function SetupGuardComponent({ locale }: { locale: string }) {
    // الاتصال داخل المكون مسموح به لأنه سيتم عزله بـ Suspense
    await connection(); 
    await connectDB();
    
    const isSetup = await StoreConfig.isSystemInitialized();
    const cookieStore = await cookies();
    const justFinished = cookieStore.has("setup_complete");

    if (isSetup && !justFinished) {
        redirect(`/${locale}`);
    }
    
    return null; // هذا المكون لا يرسم شيئاً، هو فقط للحماية
}

export default async function SetupLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen w-full bg-background text-foreground relative">
            {/* ✅ 2. وضعنا المكون داخل Suspense لإسكات خطأ Blocking Route */}
            <Suspense fallback={null}>
                <SetupGuardComponent locale={locale} />
            </Suspense>

            <div className="absolute top-4 end-4 z-50 md:top-8 md:end-8">
                <LanguageSwitcher variant="admin" />
            </div>
            {children}
        </div>
    );
}