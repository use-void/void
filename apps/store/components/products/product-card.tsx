"use client";

import { Link } from "@repo/i18n/navigation";
import { Card, CardContent, CardFooter, cn } from "@repo/ui";
import { AddToCartButton } from "../cart/add-to-cart-button";
import { useTranslations } from "next-intl";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        slug: string;
        type?: 'physical' | 'digital' | 'subscription';
    };
    locale: string;
    className?: string;
}

export function ProductCard({ product, className, locale }: ProductCardProps) {
    const t = useTranslations("Store");

    return (
        <Card className={cn(
            "group overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:shadow-md h-full flex flex-col",
            className
        )}>
            <Link 
                href={`/products/${product.slug}`} 
                className="relative aspect-square overflow-hidden bg-muted/5"
            >
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </Link>

            <CardContent className="p-4 flex-1 flex flex-col gap-1.5">
                <Link 
                    href={`/products/${product.slug}`}
                    className="block group/link"
                >
                    <h3 className="font-semibold text-sm md:text-base leading-snug line-clamp-2 transition-colors group-hover/link:text-primary">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-auto pt-2">
                    <p className="text-lg font-bold text-foreground">
                        {product.price.toLocaleString()} <span className="text-xs font-medium text-muted-foreground uppercase">{t("common.currency_SAR")}</span>
                    </p>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <AddToCartButton 
                    variant="default"
                    className="w-full"
                    locale={locale}
                    product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        slug: product.slug,
                        type: product.type
                    }}
                >
                    {product.type === 'subscription' 
                        ? (locale === 'ar' ? 'اشترك الآن' : 'Subscribe Now') 
                        : t("common.addToCart")}
                </AddToCartButton>
            </CardFooter>
        </Card>
    );
}
