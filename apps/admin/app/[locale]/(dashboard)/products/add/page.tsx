import { getTranslations, setRequestLocale } from "@repo/i18n";
import { ProductEditor } from "@/components/products/product-editor";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.products" });
    return {
        title: t("add"),
    };
}

export default async function AddProductPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { locale } = await params;
    const { type } = await searchParams;
    setRequestLocale(locale);

    return (
        <div className="flex flex-col h-full w-full">
            <ProductEditor productType={type as "physical" | "digital"} />
        </div>
    );
}
