import { setRequestLocale } from "next-intl/server";
import { ProductTypePicker } from "@/components/products";

export default async function CreateProductPage({ 
    params 
}: { 
    params: Promise<{ locale: string }> 
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-light">Create Product</h2>
                <p className="text-muted-foreground">Choose product type to start.</p>
            </div>
            
            <div className="max-w-4xl">
                <ProductTypePicker />
            </div>
        </div>
    );
}