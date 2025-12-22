import { getTranslations, setRequestLocale } from "@repo/i18n";
import { getStoreConfig } from "@/lib/actions/store-config.actions";
import { SettingsForm } from "./_components/settings-form";

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
    
    const config = await getStoreConfig();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm initialData={config} />
        </div>
    );
}

