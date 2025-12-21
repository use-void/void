import { SettingsForm } from "@/components/settings/settings-form";
import { getTranslations, setRequestLocale } from "@repo/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    return {
        title: t("title"),
    };
}

export default async function SettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Admin.settings");

    return (
        <div className="flex flex-col h-full w-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            </div>
            <SettingsForm />
        </div>
    );
}
