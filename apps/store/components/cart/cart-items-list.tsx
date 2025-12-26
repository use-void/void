"use client";

import { useTranslations, useLocale } from "@repo/i18n";
import { Button, Card, CardContent } from "@repo/ui";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Link } from "@repo/i18n/navigation";
import { formatPrice } from "@void/payment";

export function CartItemsList() {
    const t = useTranslations("Store.cart");
    const locale = useLocale();
    const { items, removeItem, updateQuantity } = useCartStore();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
                <span className="text-muted-foreground font-medium">({items.length}) {t("itemsCount")}</span>
            </div>

            {items.length === 0 ? (
                <Card className="border-dashed bg-muted/5">
                    <CardContent className="py-20 flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground/60" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t("empty")}</h3>
                        <p className="text-muted-foreground mb-8 max-w-xs">{t("emptyDescription")}</p>
                        <Link href="/products">
                            <Button variant="default" size="lg" className="rounded-xl px-8">
                                {t("continueShopping")}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <Card key={item.id} className="group overflow-hidden border-border/40 hover:border-border/80 transition-colors shadow-none hover:shadow-sm">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Image Section */}
                                    <div className="relative h-40 sm:h-auto sm:w-40 shrink-0 bg-muted/5 overflow-hidden">
                                        <Link href={`/products/${item.slug}`}>
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
                                            />
                                        </Link>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <Link href={`/products/${item.slug}`} className="hover:text-primary transition-colors">
                                                    <h3 className="font-bold text-lg leading-snug line-clamp-1">{item.name}</h3>
                                                </Link>
                                                <p className="text-sm text-muted-foreground">
                                                    {t("unitPrice")}: {formatPrice(item.price, 'SAR', locale)}
                                                </p>
                                            </div>
                                            <Button 
                                                variant="secondary" 
                                                size="icon" 
                                                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-6">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-muted/30 rounded-lg p-1 border border-border/50">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 rounded-md hover:bg-background hover:shadow-sm transition-all"
                                                    disabled={item.quantity <= 1}
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 rounded-md hover:bg-background hover:shadow-sm transition-all"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            
                                            {/* Item Total */}
                                            <div className="text-right">
                                                <p className="text-xl font-black text-foreground">
                                                    {formatPrice(item.price * item.quantity, 'SAR', locale)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
