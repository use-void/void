import { getTranslations, setRequestLocale } from "@repo/i18n";
import { ContactSettingsForm } from "@/components/settings/contact-settings";
import { FormHeader } from "@/components/layout/headers/header-form";
import { Button } from "@repo/ui";
import { Save, RotateCcw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    return {
        title: `${t("sections.contact")} | ${t("title")}`,
    };
}

const MOCK_DATA = {
    contact: {
        supportEmail: "support@techstore.sa",
        supportPhone: "+966500000000",
        whatsappNumber: "+966500000000",
        address: { ar: "الرياض، المملكة العربية السعودية", en: "Riyadh, Saudi Arabia" },
        socialLinks: {
            instagram: "https://instagram.com/techstore",
            twitter: "https://x.com/techstore",
        }
    },
};

export default async function ContactSettingsPage({
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
                title={t("sections.contact")}
                description={t("contact.support.description")}
                backHref={`/${locale}/settings`}
                primaryAction={
                    <Button size="sm" className="gap-2" form="contact-settings-form" type="submit">
                        <Save className="w-4 h-4" />
                        {t("actions.save")}
                    </Button>
                }
                secondaryAction={
                    <Button size="sm" variant="ghost" className="gap-2" form="contact-settings-form" type="reset">
                        <RotateCcw className="w-4 h-4" />
                        {t("actions.discard")}
                    </Button>
                }
            />
            <div className="w-full px-6 lg:px-10 py-8">
                <ContactSettingsForm initialData={MOCK_DATA} locale={locale} />
            </div>
        </div>
    );
}
