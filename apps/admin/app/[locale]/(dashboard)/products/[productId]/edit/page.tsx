import { getTranslations, setRequestLocale } from "@repo/i18n";
import { ProductEditor } from "@/components/products/product-editor";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; productId: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.products.details" });
    return {
        title: `${t("title")} - Edit`,
    };
}

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ locale: string; productId: string }>;
}) {
    const { locale, productId } = await params;
    setRequestLocale(locale);

    // In a real app, you'd fetch the initialData here
    const mockInitialData = {
        name: "سماعات نويز كانسيلنج برو",
        sku: "AUD-NC-001",
        price: "1,299",
        stock: 45,
        status: "نشط",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"
    }

    return (
        <div className="flex flex-col h-full w-full">
            <ProductEditor productId={productId} initialData={mockInitialData} />
        </div>
    );
}
