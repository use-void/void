"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";

export function CheckoutSummary() {
    const t = useTranslations("Store"); // Using root namespace or specifically 'Store' + keys
    // Needs keys like "checkout.orderSummary", "cart.total", "checkout.vatInclude"
    // Wait, useTranslations hook prefix depends on finding keys.
    // The previous page used t("checkout.orderSummary"). It seems "Store" namespace has "checkout" object.

    const items = useCartStore((state) => state.items);
    
    // Hydration fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = 0; // Fixed for now
    const total = subtotal + shipping;

    return (
        <div className="bg-muted/30 rounded-2xl border p-6 space-y-6 sticky top-24">
            <h3 className="text-xl font-bold">{t("checkout.orderSummary")}</h3>
            <div className="space-y-4 border-b pb-4">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                        <span>{item.price * item.quantity} {t("common.currency_SAR")}</span>
                    </div>
                ))}
            </div>
            <div className="space-y-4 text-lg font-bold">
                <div className="flex justify-between">
                    <span>{t("cart.total")}</span>
                    <span className="text-primary">{total} {t("common.currency_SAR")}</span>
                </div>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
                {t("checkout.vatInclude")}
            </p>
        </div>
    );
}
