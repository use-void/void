import { getTranslations } from "@repo/i18n";
import { Input, Label } from "@repo/ui";

export async function ShippingForm({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "Store" });

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-4">{t("checkout.shippingAddress")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">{t("checkout.firstName")}</Label>
                    <Input id="firstName" placeholder={locale === 'ar' ? 'أحمد' : 'John'} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">{t("checkout.lastName")}</Label>
                    <Input id="lastName" placeholder={locale === 'ar' ? 'محمد' : 'Doe'} />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">{t("checkout.address")}</Label>
                    <Input id="address" placeholder={locale === 'ar' ? 'اسم الشارع، رقم المنزل' : 'Street name, house number'} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">{t("checkout.city")}</Label>
                    <Input id="city" placeholder={locale === 'ar' ? 'الرياض' : 'Riyadh'} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zip">{t("checkout.zip")}</Label>
                    <Input id="zip" placeholder="12345" />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="phone">{t("checkout.phone")}</Label>
                    <Input id="phone" placeholder="05xxxxxxxx" />
                </div>
            </div>
        </div>
    );
}
