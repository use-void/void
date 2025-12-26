import { Suspense } from "react";
import { setRequestLocale } from "@repo/i18n";
import { OrderDetails, OrderDetailsSkeleton } from "@/components/orders/order-details";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; orderId: string }> }) {
    const { orderId } = await params;
    return {
        title: `Order #${orderId}`,
    };
}

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ locale: string; orderId: string }>;
}) {
    const { locale, orderId } = await params;
    setRequestLocale(locale);

    return (
        <Suspense fallback={<OrderDetailsSkeleton />}>
            <OrderDetails orderId={orderId} />
        </Suspense>
    );
}
