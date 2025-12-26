import { getTranslations } from "@repo/i18n";
import { formatPrice } from "@void/payment";

export async function ProductInfo({ 
    locale, 
    name, 
    price, 
    description 
}: { 
    locale: string;
    name: string;
    price: number;
    description: string;
}) {
    const t = await getTranslations({ locale, namespace: "Store.product" });

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{name}</h1>
            <p className="text-2xl font-bold text-primary">{formatPrice(price, 'SAR', locale)}</p>
            <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{t("description")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-muted-foreground/10">
                <p className="text-sm font-medium text-muted-foreground">
                    {t("freeDeliveryNote")}
                </p>
            </div>
        </div>
    );
}
