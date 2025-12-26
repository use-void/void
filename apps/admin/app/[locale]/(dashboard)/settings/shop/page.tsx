import { getTranslations, setRequestLocale } from "@repo/i18n";
import { ShopSettingsForm } from "@/components/settings/shop-settings";
import { FormHeader } from "@/components/layout/headers/header-form";
import { Button } from "@repo/ui";
import { Save, RotateCcw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    return {
        title: `${t("sections.shop")} | ${t("title")}`,
    };
}

const MOCK_DATA = {
    shopSettings: {
        isMaintenanceMode: false,
        maintenanceMessage: { ar: "نحن نقوم ببعض التحديثات، سنعود قريباً!", en: "We are doing some updates, we'll be back soon!" },
        isGuestCheckoutEnabled: true,
        isInventoryTrackingEnabled: true,
        announcementBar: {
            isEnabled: true,
            text: { ar: "شحن مجاني للطلبات فوق 500 ريال!", en: "Free shipping on orders over 500 SAR!" },
            link: "https://techstore.sa/offers"
        }
    },
};

export default async function ShopSettingsPage({
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
                title={t("sections.shop")}
                description={t("shop.maintenance.description")}
                backHref={`/${locale}/settings`}
                primaryAction={
                    <Button size="sm" className="gap-2" form="shop-settings-form" type="submit">
                        <Save className="w-4 h-4" />
                        {t("actions.save")}
                    </Button>
                }
                secondaryAction={
                    <Button size="sm" variant="ghost" className="gap-2" form="shop-settings-form" type="reset">
                        <RotateCcw className="w-4 h-4" />
                        {t("actions.discard")}
                    </Button>
                }
            />
            <div className="w-full px-6 lg:px-10 py-8">
                <ShopSettingsForm initialData={MOCK_DATA} locale={locale}/>
            </div>
        </div>
    );
}
