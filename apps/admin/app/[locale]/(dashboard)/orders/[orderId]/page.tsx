import { setRequestLocale, getTranslations } from "next-intl/server";
import { OrderDetailsView } from "@/components/orders";
import { mockOrdersData, getOrderById } from "@/lib/mock-data";
import { routing } from "@repo/i18n/routing";

export async function generateStaticParams() {
    const params = [];
    for (const order of mockOrdersData) {
        for (const locale of routing.locales) {
            params.push({
                orderId: order.id,
                locale: locale
            });
        }
    }
    return params;
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ locale: string; orderId: string }> }) {
    const { locale, orderId } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.orders');

    const order = getOrderById(orderId);

    if (!order) {
        return <div className="p-6 text-zinc-500">Order not found</div>;
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-light tracking-tight text-white">Order #{orderId}</h2>
                        <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-md font-mono">{order.date.split('T')[0]}</span>
                    </div>
                </div>

                <OrderDetailsView order={order as any} />
            </div>
        </div>
    );
}