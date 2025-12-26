"use client";


import { useTranslations, useLocale } from "@repo/i18n";
import { useRouter } from "@repo/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import { 
    Card, 
    CardContent, 
    CardFooter, 
    CardHeader, 
    CardTitle,
    buttonVariants,
    Separator,
    Button
} from "@repo/ui";
import { ShieldCheck } from "lucide-react";
import { formatPrice } from "@void/payment";

export function CartSummary() {
    const t = useTranslations("Store.cart");
    const tCheckout = useTranslations("Store.checkout");
    const locale = useLocale();
    const items = useCartStore((state) => state.items);
    const router = useRouter(); 
    
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = 0; 
    const total = subtotal + shipping;

    return (
        <Card className="sticky top-24 border-border/40 bg-card/50 backdrop-blur-sm shadow-none overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4">
                <CardTitle className="text-xl font-bold">{t("summary")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span className="font-medium">{formatPrice(subtotal, 'SAR', locale)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span className="text-green-600 font-bold">{t("freeShipping") || tCheckout("freeShipping")}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold">{t("total")}</span>
                    <div className="text-right">
                        <span className="text-2xl font-black text-primary">
                            {formatPrice(total, 'SAR', locale)}
                        </span>
                    </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>{tCheckout("payment.securePayment")}</span>
                </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 pb-6">
                <Button 
                    onClick={async () => {
                        setIsLoading(true);
                        try {
                            const { syncCartWithDB } = await import("@/app/actions/cart");
                            const clientId = localStorage.getItem('cart-session-id') || Math.random().toString(36).substring(7);
                            localStorage.setItem('cart-session-id', clientId);
                            
                            const result = await syncCartWithDB(undefined, clientId, items);
                            if (result.success && result.cartId) {
                                router.push(`/checkout?cartId=${result.cartId}`);
                            } else {
                                router.push(`/checkout`);
                            }
                        } catch (e) {
                             console.error(e);
                             router.push(`/checkout`);
                        }
                        setIsLoading(false);
                    }}
                    disabled={items.length === 0 || isLoading}
                    className={buttonVariants({ 
                        variant: "default",
                        className: "w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                    })}
                >
                    {isLoading ? t("preparing") : t("checkout")}
                </Button>
                <div className="space-y-2 text-center">
                    <p className="text-[10px] text-muted-foreground">
                        {t("taxIncluded")}
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}
