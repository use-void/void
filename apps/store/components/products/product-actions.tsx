import { Button } from "@repo/ui";
import { getTranslations } from "@repo/i18n";
import { ShoppingCart, Heart } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { CartItem } from "@/stores/cart-store";

export async function ProductActions({ locale, product }: { locale: string, product: Omit<CartItem, 'quantity'> }) {
    const t = await getTranslations({ locale, namespace: "Store" });

    return (
        <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center gap-4">
                <AddToCartButton 
                    size="lg" 
                    className="flex-1 h-12 text-lg font-bold" 
                    product={product}
                    locale={locale}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.type === 'subscription' 
                        ? (locale === 'ar' ? 'اشترك الآن' : 'Subscribe Now') 
                        : t("common.addToCart")}
                </AddToCartButton>
                <Button size="lg" variant="outline" className="h-12 w-12 p-0 rounded-full border-muted-foreground/20 hover:text-red-500 hover:border-red-500 transition-colors">
                    <Heart className="h-6 w-6" />
                </Button>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-2">
                منتج أصلي 100% | ضمان سنة كاملة
            </p>
        </div>
    );
}
