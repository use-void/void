import { getTranslations, setRequestLocale } from "@repo/i18n";
import { SEOSettingsForm } from "@/components/settings/seo-settings";
import { FormHeader } from "@/components/layout/headers/header-form";
import { Button } from "@repo/ui";
import { Save, RotateCcw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    return {
        title: `${t("sections.seo")} | ${t("title")}`,
    };
}

const MOCK_DATA = {
    seo: {
        metaTitleTemplate: { ar: "%s | متجري التقني", en: "%s | My Tech Store" },
        metaDescriptionDefault: { 
            ar: "اكتشف أفضل العروض على الأجهزة الذكية والملحقات التقنية.",
            en: "Discover the best deals on smart devices and tech accessories."
        },
    },
};

export default async function SEOSettingsPage({
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
                title={t("sections.seo")}
                description={t("seo.general.description")}
                backHref={`/${locale}/settings`}
                primaryAction={
                    <Button size="sm" className="gap-2" form="seo-settings-form" type="submit">
                        <Save className="w-4 h-4" />
                        {t("actions.save")}
                    </Button>
                }
                secondaryAction={
                    <Button size="sm" variant="ghost" className="gap-2" form="seo-settings-form" type="reset">
                        <RotateCcw className="w-4 h-4" />
                        {t("actions.discard")}
                    </Button>
                }
            />
            <div className="w-full px-6 lg:px-10 py-8">
                <SEOSettingsForm initialData={MOCK_DATA} locale={locale} />
            </div>
        </div>
    );
}
