import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PhysicalProductForm, DigitalProductForm } from "@/components/products";

// 1. إضافة هذه الدالة لتحويل الصفحة إلى Static
export function generateStaticParams() {
    return [
        { type: 'physical' },
        { type: 'digital' }
    ];
}

export default async function CreateProductTypePage({ 
    params 
}: { 
    params: Promise<{ locale: string; type: string }> 
}) {
    const { locale, type } = await params;
    setRequestLocale(locale);

    if (type !== 'physical' && type !== 'digital') {
        notFound();
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-light capitalize">New {type} Product</h2>
                <p className="text-muted-foreground">Fill in the details below.</p>
            </div>

            {type === 'physical' ? <PhysicalProductForm /> : <DigitalProductForm />}
        </div>
    );
}