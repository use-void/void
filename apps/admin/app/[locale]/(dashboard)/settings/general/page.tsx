import { getTranslations, setRequestLocale } from "@repo/i18n";
import { GeneralSettingsForm } from "@/components/settings/general-settings";
import { FormHeader } from "@/components/layout/headers/header-form";
import { Button } from "@repo/ui";
import { Save, RotateCcw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    return {
        title: `${t("sections.general")} | ${t("title")}`,
    };
}

const MOCK_DATA = {
    name: { ar: "متجري التقني", en: "My Tech Store" },
    slogan: { ar: "أفضل التقنيات بين يديك", en: "Best tech in your hands" },
    description: { 
        ar: "متجر متخصص في بيع أحدث الأجهزة الإلكترونية والبرمجيات بأفضل الأسعار.",
        en: "A store specialized in selling the latest electronic devices and software at best prices."
    },
    assets: {
        logoPrimary: "",
        logoSecondary: "",
        favicon: "",
    },
};

export default async function GeneralSettingsPage({
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
                title={t("sections.general")}
                description={t("general.basicInfo.description")}
                backHref={`/${locale}/settings`}
                primaryAction={
                    <Button size="sm" className="gap-2" form="general-settings-form" type="submit">
                        <Save className="w-4 h-4" />
                        {t("actions.save")}
                    </Button>
                }
                secondaryAction={
                    <Button size="sm" variant="ghost" className="gap-2" form="general-settings-form" type="reset">
                        <RotateCcw className="w-4 h-4" />
                        {t("actions.discard")}
                    </Button>
                }
            />
            <div className="w-full px-6 lg:px-10 py-8">
                <GeneralSettingsForm initialData={MOCK_DATA} locale={locale} id="general-settings-form" />
            </div>
        </div>
    );
}
