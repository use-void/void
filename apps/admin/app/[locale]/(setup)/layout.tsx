import { checkSetupStatus } from "../../../lib/setup-status";
import { setRequestLocale } from "@repo/i18n";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";

async function SetupGuard({ locale }: { locale: string }) {
    // Block access if already setup, unless we just finished (cookie check)
    const isSetup = await checkSetupStatus();
    const cookieStore = await cookies();
    const justFinished = cookieStore.has("setup_complete");

    if (isSetup && !justFinished) {
        redirect(`/${locale}/login`);
    }
    return null;
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
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Suspense fallback={null}>
                <SetupGuard locale={locale} />
            </Suspense>
            <div className="w-full max-w-[600px]">
                {children}
            </div>
        </div>
    );
}
