import { getFormatter, getTranslations } from "@repo/i18n";
import { Badge, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Separator } from "@repo/ui";
import { getUserOrders } from "@/app/actions/orders";

export async function OrderHistory({ locale, userId }: { locale: string, userId: string }) {
    const t = await getTranslations({ locale, namespace: "Store.account" });
    const format = await getFormatter();
    const orders = await getUserOrders(userId);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-4 text-start">{t("myOrders")}</h3>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {t("noOrders")}
                    </div>
                ) : (
                    <Accordion className="space-y-4">
                        {orders.map((order) => (
                            <AccordionItem key={order.id} value={order.id} className="border rounded-xl overflow-hidden bg-background">
                            <AccordionTrigger className="hover:underline-none p-0 border-none transition-all data-[state=open]:bg-muted/5 group">
                                <div className="flex flex-wrap items-center justify-between p-4 gap-4 w-full">
                                    <div className="space-y-1 text-start">
                                        <p className="font-bold">#{order.orderNumber}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format.dateTime(new Date(order.createdAt), { dateStyle: 'long' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-start md:text-end">
                                            <p className="text-sm text-muted-foreground">{t("total")}</p>
                                            <p className="font-bold">{order.total} {locale === 'ar' ? 'ر.س' : 'SAR'}</p>
                                        </div>
                                        <Badge variant={order.status === "completed" || order.status === "delivered" ? "default" : "secondary"} className="h-7 px-4">
                                            {t(`statuses.${order.status}`)}
                                        </Badge>
                                    </div>
                                </div>
                            </AccordionTrigger>
                                <AccordionContent className="border-t bg-muted/5 px-4 pt-6 pb-6">
                                    <div className="space-y-6">
                                        {/* Order Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">{t("status")}</p>
                                                <Badge variant={order.status === "completed" ? "default" : "outline"} className="capitalize">
                                                    {t(`statuses.${order.status}`)}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">{t("total")}</p>
                                                <p className="font-bold">{order.total} {locale === 'ar' ? 'ر.س' : 'SAR'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">{t("date")}</p>
                                                <p className="text-sm font-medium">{format.dateTime(new Date(order.createdAt), { dateStyle: 'long', timeStyle: 'short' })}</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Payment Details */}
                                        {order.transactions && order.transactions.length > 0 && (
                                            <div className="space-y-4 text-start">
                                                <h4 className="font-semibold text-base">{t("paymentDetails")}</h4>
                                                
                                                <div className="space-y-4">
                                                    {order.transactions.map((tx: any) => (
                                                        <div key={tx._id} className="p-4 border rounded-lg space-y-4 bg-muted/10 relative overflow-hidden">
                                                            <div className="flex justify-between items-center">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-sm font-bold uppercase">
                                                                            {tx.paymentMethodType === 'stcpay' ? 'STC PAY' : 
                                                                             tx.paymentMethodType === 'applepay' ? 'APPLE PAY' : 
                                                                             tx.paymentMethodType === 'creditcard' ? 'CARD' : 
                                                                             tx.provider}
                                                                        </p>
                                                                        {tx.reference && <Badge variant="outline" className="text-[10px] h-4 px-1">{tx.reference}</Badge>}
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground font-mono">{tx.providerTransactionId || tx._id}</p>
                                                                </div>
                                                                <Badge variant={tx.status === 'paid' ? 'default' : tx.status === 'failed' ? 'destructive' : 'secondary'} className="capitalize">
                                                                    {t(`statuses.${tx.status}`)}
                                                                </Badge>
                                                            </div>

                                                            {tx.paymentMethodType === 'stcpay' && tx.rawResponse?.source?.mobile && (
                                                                <div className="text-sm bg-background p-3 rounded-lg border flex justify-between items-center">
                                                                    <div>
                                                                        <p className="font-bold">STC Pay</p>
                                                                        <p className="text-muted-foreground">{tx.rawResponse.source.mobile}</p>
                                                                    </div>
                                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Mobile Payment</Badge>
                                                                </div>
                                                            )}

                                                            {tx.cardDetails && (
                                                                <div className="text-sm bg-background p-3 rounded-lg border flex justify-between items-center">
                                                                    <div>
                                                                        <p className="font-bold">{tx.cardDetails.name}</p>
                                                                        <p className="text-muted-foreground flex items-center gap-1.5 pt-0.5">
                                                                            <span className="capitalize">{tx.cardDetails.brand} {tx.cardDetails.scheme}</span>
                                                                            <span>•••• {tx.cardDetails.last4}</span>
                                                                        </p>
                                                                    </div>
                                                                    {tx.gatewayId && <p className="text-[10px] text-muted-foreground border p-1 rounded bg-muted/5">{tx.gatewayId}</p>}
                                                                </div>
                                                            )}
                                                            
                                                            {tx.status === 'failed' && tx.failureReason && (
                                                                <div className="text-sm text-red-600 bg-red-50/50 p-3 rounded-lg border border-red-100/50">
                                                                    <p className="font-semibold pb-1">{t("failureReason")}</p>
                                                                    <p className="text-xs opacity-90">{tx.failureReason}</p>
                                                                </div>
                                                            )}

                                                            {/* Timeline */}
                                                            {tx.timeline && tx.timeline.length > 0 && (
                                                                <div className="space-y-3 pt-2">
                                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("timeline")}</p>
                                                                    <div className="relative border-s-2 border-muted/50 ps-6 space-y-6 py-2">
                                                                        {tx.timeline.map((event: any, eventIdx: number) => (
                                                                            <div key={eventIdx} className="relative group/step text-start">
                                                                                <div className="absolute start-[-31px] top-1 h-3 w-3 rounded-full bg-muted-foreground/20 border-2 border-background ring-2 ring-transparent group-hover/step:ring-muted transition-all" />
                                                                                <p className="text-sm font-medium leading-none">{event.message}</p>
                                                                                <p className="text-[11px] text-muted-foreground mt-1.5 opacity-70">
                                                                                    {format.dateTime(new Date(event.date), { timeStyle: 'short' })}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    );
}
