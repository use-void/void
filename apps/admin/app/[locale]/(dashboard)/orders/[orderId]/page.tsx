import { Suspense } from "react";
import { OrderDetails, OrderDetailsSkeleton } from "@/components/orders/order-details";
import { getTranslations, setRequestLocale } from "@repo/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; orderId: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.orders.details" });
    return {
        title: t("title"),
    };
}

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ locale: string; orderId: string }>;
}) {
    const { locale, orderId } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Admin.orders.details");

    return (
        <div className="flex flex-col h-full w-full space-y-6">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            </div>
            <Suspense fallback={<OrderDetailsSkeleton />}>
                <OrderDetails orderId={orderId} />
            </Suspense>
        </div>
    );
}
