import { Suspense } from "react";
import { ProductDetails, ProductDetailsSkeleton } from "@/components/products/product-details";
import { getTranslations, setRequestLocale } from "@repo/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; productId: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.products.details" });
    return {
        title: t("title"),
    };
}

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ locale: string; productId: string }>;
}) {
    const { locale, productId } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Admin.products.details");

    return (
        <div className="flex flex-col h-full w-full space-y-6">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            </div>
            <Suspense fallback={<ProductDetailsSkeleton />}>
                <ProductDetails productId={productId} />
            </Suspense>
        </div>
    );
}
