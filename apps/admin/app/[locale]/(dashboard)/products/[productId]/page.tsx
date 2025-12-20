// apps\admin\app\[locale]\(dashboard)\products\[productId]\page.tsx

import { setRequestLocale } from "next-intl/server";
import { PhysicalProductForm, DigitalProductForm } from "@/components/products";
import { getProductById } from "@/lib/actions/product.actions"; // ✅ استدعاء الدالة المحمية
import { notFound } from "next/navigation";

// ❌ حذفنا generateStaticParams تماماً
// لا نريد بناء صفحات ثابتة للوحة التحكم، نريد بيانات حية ومحمية دائماً.

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ locale: string; productId: string }>;
}) {
    const { locale, productId } = await params;
    setRequestLocale(locale);

    // الآن نستخدم الدالة الموحدة والمحمية
    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-foreground">
                        Edit {product.type === "physical" ? "Physical" : "Digital"} Product
                    </h2>
                    <p className="text-muted-foreground font-light">
                        Update details for {product.name}
                    </p>
                </div>

                {product.type === "physical" ? (
                    <PhysicalProductForm defaultValues={product} isEditing />
                ) : (
                    <DigitalProductForm defaultValues={product} isEditing />
                )}
            </div>
        </div>
    );
}