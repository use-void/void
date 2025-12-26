import { getTranslations, setRequestLocale } from "@repo/i18n";
import { LanguageSettingsForm } from "@/components/settings/language-settings";
import { FormHeader } from "@/components/layout/headers/header-form";
import { Button } from "@repo/ui";
import { Save, RotateCcw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    return {
        title: `${t("sections.localization")} | ${t("title")}`,
    };
}

const MOCK_DATA = {
    localization: {
        defaultLanguage: "en",
        languages: [
            { code: "en", name: "English", isRTL: false, isActive: true },
            { code: "ar", name: "Arabic", isRTL: true, isActive: true },
        ],
        timezone: "Asia/Riyadh",
    },
    financials: {
        defaultCurrency: "SAR",
        currencies: [
            { code: "SAR", symbol: { ar: "ر.س", en: "SAR" }, exchangeRate: 1, isActive: true, decimalPlaces: 2 },
            { code: "USD", symbol: { ar: "$", en: "$" }, exchangeRate: 3.75, isActive: true, decimalPlaces: 2 },
        ],
        tax: {
            taxId: "300012345600003",
            isTaxEnabled: true,
            isTaxInclusive: true,
        }
    },
};

export default async function LanguageSettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    
    return (
        <div className="flex flex-col w-full min-h-screen pb-20">
            <FormHeader 
                title={t("sections.localization")}
                description={t("localization.regional.description")}
                backHref={`/${locale}/settings`}
                primaryAction={
                    <Button size="sm" className="gap-2" form="language-settings-form" type="submit">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                }
                secondaryAction={
                    <Button size="sm" variant="ghost" className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Discard
                    </Button>
                }
            />

            <div className="w-full px-6 lg:px-10 py-8">
                <LanguageSettingsForm initialData={MOCK_DATA} locale={locale} id="language-settings-form" />
            </div>
        </div>
    );
}
