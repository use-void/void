import { Suspense } from "react";
import { setRequestLocale } from "@repo/i18n";
import { Button } from "@repo/ui";
import { Undo2, Printer, FileText, MoreVertical } from "lucide-react";
import { Link } from "@repo/i18n/navigation";
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
        <div className="flex flex-col w-full min-h-screen">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border ">
                <div className="flex items-center justify-between h-16 w-full px-6">
                    <div className="flex items-center gap-4 text-start">
                        <Link href="/orders">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Undo2 className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-tight">Order #{orderId}</h1>
                            <p className="text-xs text-muted-foreground">Dec 24, 2025 at 4:30 PM</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="font-semibold gap-2 hidden md:flex">
                            <Printer className="h-4 w-4" />
                            <span>Print</span>
                        </Button>
                        <Button variant="outline" size="sm" className="font-semibold gap-2 hidden md:flex">
                            <FileText className="h-4 w-4" />
                            <span>Invoice</span>
                        </Button>
                        <div className="h-6 w-[1px] bg-border mx-1 hidden md:block" />
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full p-10">
                <Suspense fallback={<OrderDetailsSkeleton />}>
                    <OrderDetails />
                </Suspense>
            </div>
        </div>
    );
}
