import { setRequestLocale, getTranslations } from "next-intl/server";
import { PhysicalProductForm } from "@/components/products";
import { mockProductsData, getProductById } from "@/lib/mock-data";
import { routing } from "@repo/i18n/routing";

export async function generateStaticParams() {
    const params = [];
    for (const product of mockProductsData) {
        for (const locale of routing.locales) {
            params.push({
                productId: product.id,
                locale: locale
            });
        }
    }
    return params;
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ locale: string; productId: string }> }) {
    const { locale, productId } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.products');

    const product = getProductById(productId);

    if (!product) {
        return <div className="p-6 text-zinc-500">Product not found</div>;
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">Edit Product</h2>
                    <p className="text-zinc-500 font-light">Update product details for #{productId}.</p>
                </div>

                {/* For demo purposes, we always load the physical form with mock data */}
                <PhysicalProductForm defaultValues={product as any} />
            </div>
        </div>
    );
}
