import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ProductTypePicker } from "@/components/products";

export default async function CreateProductPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.products');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">Create Product</h2>
                    <p className="text-zinc-500 font-light">Select the type of product you want to create.</p>
                </div>
                <div className="max-w-4xl">
                    <Suspense fallback={<div>Loading options...</div>}>
                        <ProductTypePicker />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
