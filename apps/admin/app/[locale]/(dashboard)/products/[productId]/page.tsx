import { Suspense } from "react";
import { ProductDetails, ProductDetailsSkeleton } from "@/components/products/product-details";
import { getTranslations, setRequestLocale } from "@repo/i18n";
import { Button } from "@repo/ui";
import { Undo2, Pencil } from "lucide-react";
import { Link } from "@repo/i18n/navigation";

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
        <div className="flex flex-col w-full min-h-screen">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border ">
                <div className="flex items-center justify-between h-16 w-full px-6">
                    <div className="flex items-center gap-4 text-start">
                        <Link href="/products">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Undo2 className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                         <Link href={`/products/${productId}/edit`}>
                            <Button size="sm" className="font-semibold gap-2">
                                <Pencil className="h-4 w-4" />
                                <span>تعديل المنتج</span>
                            </Button>
                         </Link>
                    </div>
                </div>
            </div>

            <div className="w-full p-10">
                <Suspense fallback={<ProductDetailsSkeleton />}>
                    <ProductDetails productId={productId} />
                </Suspense>
            </div>
        </div>
    );
}
