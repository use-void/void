import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CreateOrderForm } from "@/components/orders";

export default async function CreateOrderPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.orders');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">Create Order</h2>
                    <p className="text-zinc-500 font-light">Create a new order manually.</p>
                </div>

                <Suspense fallback={<div>Loading form...</div>}>
                    <CreateOrderForm />
                </Suspense>
            </div>
        </div>
    );
}
