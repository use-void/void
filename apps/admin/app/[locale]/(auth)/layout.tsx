import { LanguageSwitcher } from "@repo/ui";
import { setRequestLocale } from "next-intl/server";

import { checkSetupStatus } from "../../../lib/setup-status";
import { redirect } from "next/navigation";


export default async function AuthLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);


    // Check Setup Status (Force Setup if not initialized)
    const isSetup = await checkSetupStatus();
    if (!isSetup) {
        redirect(`/${locale}/setup`);
    }

    return (
        <div className="relative min-h-screen w-full bg-background">
            <div className="absolute top-4 end-4 z-50 md:top-8 md:end-8">
                <LanguageSwitcher variant="admin" />
            </div>
            {children}
        </div>
    );
}
