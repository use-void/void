import { LanguageSwitcher } from "@repo/ui";
import { setRequestLocale, getLocaleDir } from "@repo/i18n";
import { redirect } from "next/navigation";
import { auth } from "@void/auth";
import { connection } from "next/server";
import { headers } from "next/headers";
import { Suspense } from "react";

// ✅ 1. مكون الحماية المنفصل
async function AuthGuardComponent({ locale }: { locale: string }) {
    await connection();

    // فحص تسجيل الدخول
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect(`/${locale}`);
    }

    return null;
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

    const side = getLocaleDir(locale) === "rtl" ? "end" : "end"; // end-4 matches right-4 logic for both

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-background flex flex-col items-center justify-center">
            {/* ✅ 2. وضع المكون داخل Suspense */}
            <Suspense fallback={null}>
                <AuthGuardComponent locale={locale} />
            </Suspense>

            <div className="absolute top-4 end-4 z-50 md:top-8 md:end-8">
                <LanguageSwitcher variant="store" />
            </div>

            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
