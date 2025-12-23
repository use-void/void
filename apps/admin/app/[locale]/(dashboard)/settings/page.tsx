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
    


    return (
        <div className="flex flex-col h-full w-full space-y-4">
        </div>
    );
}

