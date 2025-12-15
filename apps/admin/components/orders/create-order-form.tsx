"use client";

import { useTranslations } from "next-intl";
import { Button, Input, Label, Textarea } from "@repo/ui";
import { Search, Plus, Trash, ArrowLeft, Save } from "lucide-react";
import { Link } from "@repo/i18n/navigation";
import { useState } from "react";

export function CreateOrderForm() {
    const [lineItems, setLineItems] = useState([{ id: 1, name: "", quantity: 1, price: 0 }]);

    const addLineItem = () => {
        setLineItems([...lineItems, { id: Date.now(), name: "", quantity: 1, price: 0 }]);
    };

    const removeLineItem = (id: number) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const total = lineItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    return (
        <div className="max-w-4xl space-y-8">
            <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
                <div className="space-y-8">
                    {/* Products */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white">Products</h3>
                            <Button variant="outline" size="sm" onClick={addLineItem}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {lineItems.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-[1fr,100px,100px,40px] gap-4 items-end">
                                    <div className="grid gap-2">
                                        <Label className={index > 0 ? "sr-only" : ""}>Product</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input className="pl-9" placeholder="Search products..." />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className={index > 0 ? "sr-only" : ""}>Quantity</Label>
                                        <Input type="number" defaultValue={item.quantity} min={1} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className={index > 0 ? "sr-only" : ""}>Price</Label>
                                        <Input type="number" defaultValue={item.price} min={0} />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive h-10 w-10 mb-[1px]"
                                        onClick={() => removeLineItem(item.id)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
                            <span className="font-medium text-zinc-400">Total</span>
                            <span className="font-bold text-white text-lg">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Payment</h3>
                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1">Mark as Paid</Button>
                            <Button variant="outline" className="flex-1">Send Invoice</Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Customer</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Select Customer</Label>
                                <Input placeholder="Search customer..." />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Notes</h3>
                        <Textarea placeholder="Internal notes..." className="min-h-[100px]" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
                <Link href="/orders">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </Link>
                <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Create Order
                </Button>
            </div>
        </div>
    );
}
