import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PhysicalProductForm, DigitalProductForm } from "@/components/products";
import { notFound } from "next/navigation";

export function generateStaticParams() {
    return [
        { type: 'physical' },
        { type: 'digital' }
    ];
}

export default async function CreateProductTypePage({ params }: { params: Promise<{ locale: string; type: string }> }) {
    const { locale, type } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.products');

    const validTypes = ['physical', 'digital'];
    if (!validTypes.includes(type)) {
        notFound();
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">
                        Create {type === 'physical' ? 'Physical' : 'Digital'} Product
                    </h2>
                    <p className="text-zinc-500 font-light">Fill in the details for your new product.</p>
                </div>

                <Suspense fallback={<div>Loading form...</div>}>
                    {type === 'physical' ? (
                        <PhysicalProductForm />
                    ) : (
                        <DigitalProductForm />
                    )}
                </Suspense>
            </div>
        </div>
    );
}
