import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { Link } from "@repo/i18n/navigation";
import { getTranslations } from "@repo/i18n";

async function getOrders() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [
        { id: "ORD-001", customer: "Alice Johnson", total: "$120.00", status: "Processing", date: "2023-10-25" },
        { id: "ORD-002", customer: "Bob Smith", total: "$45.50", status: "Shipped", date: "2023-10-24" },
        { id: "ORD-003", customer: "Charlie Brown", total: "$89.99", status: "Delivered", date: "2023-10-23" },
    ];
}

export async function OrderList() {
    const orders = await getOrders();
    const t = await getTranslations("Admin.orders");

    return (
        <Card className="bg-card border-border rounded-xl">
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link href={`/orders/${order.id}`} key={order.id} className="block group">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-background group-hover:border-primary/50 transition-colors">
                                <div>
                                    <p className="font-medium">{order.id}</p>
                                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                                </div>
                                 <div className="text-right">
                                    <p className="font-medium">{order.total}</p>
                                    <p className="text-sm text-muted-foreground">{order.date}</p>
                                </div>
                                <div>
                                    <span className={`px-2 py-1 text-xs rounded-full 
                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                                          'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function OrderListSkeleton() {
    return (
        <Card className="bg-card border-border rounded-xl">
            <CardHeader>
                 <Skeleton className="h-6 w-[150px] bg-muted" />
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                         <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[100px] bg-muted" />
                                <Skeleton className="h-3 w-[150px] bg-muted/50" />
                            </div>
                             <div className="space-y-2 text-right">
                                <Skeleton className="h-4 w-[80px] bg-muted" />
                                <Skeleton className="h-3 w-[100px] bg-muted/50" />
                            </div>
                            <Skeleton className="h-6 w-[80px] bg-muted" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
