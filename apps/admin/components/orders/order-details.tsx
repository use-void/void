import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { getTranslations } from "@repo/i18n";

async function getOrderDetails(id: string) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
        id,
        customer: "Alice Johnson",
        items: [
            { name: "Product A", qty: 2, price: "$20.00" },
            { name: "Product B", qty: 1, price: "$80.00" }
        ],
        total: "$120.00",
        status: "Processing",
        shippingAddress: "123 Main St, Anytown, USA",
        paymentMethod: "Credit Card ending in 4242"
    };
}

export async function OrderDetails({ orderId }: { orderId: string }) {
    const order = await getOrderDetails(orderId);
    const t = await getTranslations("Admin.orders.details");

    return (
        <div className="space-y-6">
            <Card className="bg-card border-border rounded-xl">
                <CardHeader>
                    <CardTitle>{t("title")} #{order.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                             <h3 className="font-semibold mb-2">{t("customerInfo")}</h3>
                             <p className="text-sm text-muted-foreground">{order.customer}</p>
                             <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                        </div>
                        <div>
                             <h3 className="font-semibold mb-2">{t("orderInfo")}</h3>
                             <p className="text-sm text-muted-foreground">{t("status")}: {order.status}</p>
                             <p className="text-sm text-muted-foreground">{t("payment")}: {order.paymentMethod}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-4">{t("items")}</h3>
                         <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                    <span>{item.name} x{item.qty}</span>
                                    <span>{item.price}</span>
                                </div>
                            ))}
                        </div>
                         <div className="flex justify-between items-center pt-4 mt-4 border-t font-bold">
                             <span>{t("total")}</span>
                             <span>{order.total}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function OrderDetailsSkeleton() {
    return (
        <div className="space-y-6">
             <Card className="bg-card border-border rounded-xl">
                 <CardHeader>
                    <Skeleton className="h-8 w-[200px] bg-muted" />
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <Skeleton className="h-5 w-[120px] bg-muted mb-2" />
                             <Skeleton className="h-3 w-[150px] bg-muted/50" />
                             <Skeleton className="h-3 w-[200px] bg-muted/50" />
                        </div>
                         <div className="space-y-2">
                             <Skeleton className="h-5 w-[100px] bg-muted mb-2" />
                             <Skeleton className="h-3 w-[120px] bg-muted/50" />
                             <Skeleton className="h-3 w-[180px] bg-muted/50" />
                        </div>
                    </div>
                     <div>
                        <Skeleton className="h-5 w-[100px] bg-muted mb-4" />
                         <div className="space-y-3">
                             {[1, 2].map((i) => (
                                 <div key={i} className="flex justify-between items-center pb-2">
                                     <Skeleton className="h-4 w-[150px] bg-muted" />
                                     <Skeleton className="h-4 w-[50px] bg-muted" />
                                </div>
                             ))}
                        </div>
                         <div className="flex justify-between items-center pt-4 mt-4 border-t">
                             <Skeleton className="h-5 w-[80px] bg-muted" />
                             <Skeleton className="h-5 w-[60px] bg-muted" />
                        </div>
                    </div>
                 </CardContent>
             </Card>
        </div>
    );
}
