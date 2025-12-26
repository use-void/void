import { getTranslations } from "@repo/i18n";
import { Badge } from "@repo/ui";
import { getUserOrders } from "@/app/actions/orders";

export async function OrderHistory({ locale, userId }: { locale: string, userId: string }) {
    const t = await getTranslations({ locale, namespace: "Store.account" });
    const orders = await getUserOrders(userId);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-4">{t("myOrders")}</h3>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {t("noOrders")}
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="flex flex-wrap items-center justify-between p-4 border rounded-xl hover:bg-muted/5 transition-colors gap-4">
                            <div className="space-y-1">
                                <p className="font-bold">#{order.orderNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString(locale)}
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-left md:text-right">
                                    <p className="text-sm text-muted-foreground">{t("total")}</p>
                                    <p className="font-bold">{order.total} {locale === 'ar' ? 'ر.س' : 'SAR'}</p>
                                </div>
                                <Badge variant={order.status === "completed" || order.status === "delivered" ? "default" : "secondary"} className="h-7 px-4">
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
