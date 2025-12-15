"use client";

import { cn } from "@repo/ui";
import { Button } from "@repo/ui";
import { ArrowLeft, Printer, Mail } from "lucide-react";
import { Link } from "@repo/i18n/navigation";

export function OrderDetailsView({ order }: { order: any }) {
    return (
        <div className="space-y-8">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Link href="/orders">
                    <Button variant="ghost" size="sm" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Orders
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Invoice
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
                <div className="space-y-8">
                    {/* Order Items */}
                    <div className="border border-zinc-800 rounded-xl bg-card overflow-hidden">
                        <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className="font-medium text-white">Order Items</h3>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-400">
                                    {order.items.length} items
                                </span>
                            </div>
                            <span className={cn(
                                "capitalize px-2 py-1 rounded-md text-xs font-medium border",
                                order.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            )}>
                                {order.status}
                            </span>
                        </div>
                        <div className="divide-y divide-zinc-800">
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-zinc-800 rounded-md border border-zinc-700"></div>
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.variant}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                                        <p className="font-medium text-sm">${item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-zinc-900/20 border-t border-zinc-800 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>${order.shipping}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold pt-2 border-t border-zinc-800 mt-2">
                                <span>Total</span>
                                <span>${order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="p-6 border border-zinc-800 rounded-xl bg-card space-y-4">
                        <h3 className="font-medium text-white">Customer</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                                {order.customer.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <Link href={`/customers/${order.customer.id}`} className="text-sm font-medium hover:underline text-blue-400">
                                    {order.customer.name}
                                </Link>
                                <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-zinc-800">
                            <h4 className="text-xs font-medium text-white mb-2">Shipping Address</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                {order.shippingAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
