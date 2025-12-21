import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PhysicalProductForm, DigitalProductForm } from "@/components/products";
import { getProductById } from "@/lib/actions/product.actions";

async function EditProductContent({ productId }: { productId: string }) {
    const product = await getProductById(productId);

    if (!product) notFound();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-light">Edit {product.name}</h2>
                <p className="text-muted-foreground">Update your product details.</p>
            </div>

            {product.type === "physical" ? (
                <PhysicalProductForm defaultValues={product} isEditing />
            ) : (
                <DigitalProductForm defaultValues={product} isEditing />
            )}
        </div>
    );
}

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ productId: string }>;
}) {
    const { productId } = await params;

    return (
        <div className="p-6">
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading product details...</div>}>
                <EditProductContent productId={productId} />
            </Suspense>
        </div>
    );
}