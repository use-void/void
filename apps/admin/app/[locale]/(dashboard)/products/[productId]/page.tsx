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
        <Suspense fallback={<ProductDetailsSkeleton />}>
            <ProductDetails productId={productId} />
        </Suspense>
    );
}
