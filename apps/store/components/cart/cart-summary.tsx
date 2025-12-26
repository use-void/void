"use client";

import { useTranslations } from "next-intl";
import { Link } from "@repo/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import { 
    Card, 
    CardContent, 
    CardFooter, 
    CardHeader, 
    CardTitle,
    buttonVariants,
    Separator
} from "@repo/ui";
import { ShieldCheck } from "lucide-react";

export function CartSummary() {
    const t = useTranslations("Store.cart");
    const items = useCartStore((state) => state.items);
    
    // Hydration fix for persisting store
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = 0; // Fixed for now
    const total = subtotal + shipping;

    return (
        <Card className="sticky top-24 border-border/40 bg-card/50 backdrop-blur-sm shadow-none overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4">
                <CardTitle className="text-xl font-bold">{t("summary")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span className="font-medium">{subtotal.toLocaleString()} {t("currency_SAR")}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span className="text-green-600 font-bold">{t("free") || "مجاني"}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold">{t("total")}</span>
                    <div className="text-right">
                        <span className="text-2xl font-black text-primary">
                            {total.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-primary mr-1 uppercase">
                            {t("currency_SAR")}
                        </span>
                    </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>تشفير آمن بنسبة 100% ودفع موثوق</span>
                </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 pb-6">
                <Link 
                    href="/checkout" 
                    className={buttonVariants({ 
                        variant: "default",
                        className: "w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                    })}
                >
                    {t("checkout")}
                </Link>
                <div className="space-y-2 text-center">
                    <p className="text-[10px] text-muted-foreground">
                        {t("taxIncluded") || "الأسعار تشمل ضريبة القيمة المضافة"}
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}
