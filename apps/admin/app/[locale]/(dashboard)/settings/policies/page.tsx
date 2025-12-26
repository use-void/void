import { getTranslations, setRequestLocale } from "@repo/i18n";
import { PoliciesSettingsForm } from "@/components/settings/policies-settings";
import { FormHeader } from "@/components/layout/headers/header-form";
import { Button } from "@repo/ui";
import { Save, RotateCcw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    return {
        title: `${t("sections.policies")} | ${t("title")}`,
    };
}

const MOCK_DATA = {
    policies: {
        termsAndConditions: { ar: "نص الشروط والأحكام هنا...", en: "Terms and conditions text here..." },
        privacyPolicy: { ar: "نص سياسة الخصوصية هنا...", en: "Privacy policy text here..." },
    }
};

export default async function PoliciesSettingsPage({
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
                title={t("sections.policies")}
                description={t("policies.description")}
                backHref={`/${locale}/settings`}
                primaryAction={
                    <Button size="sm" className="gap-2" form="policies-settings-form" type="submit">
                        <Save className="w-4 h-4" />
                        {t("actions.save")}
                    </Button>
                }
                secondaryAction={
                    <Button size="sm" variant="ghost" className="gap-2" form="policies-settings-form" type="reset">
                        <RotateCcw className="w-4 h-4" />
                        {t("actions.discard")}
                    </Button>
                }
            />
            <div className="w-full px-6 lg:px-10 py-8">
                <PoliciesSettingsForm initialData={MOCK_DATA} locale={locale}/>
            </div>
        </div>
    );
}
