"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCartStore, CartItem } from "@/stores/cart-store";
import { initiatePolarCheckout } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";

import { useTranslations, useLocale } from "@repo/i18n";

interface AddToCartButtonProps {
    children: React.ReactNode;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    product?: Omit<CartItem, 'quantity'>;
}

export function AddToCartButton({ 
    children, 
    className,
    size = "default",
    variant = "default",
    product,
}: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const t = useTranslations("Store");
    const locale = useLocale();
    const router = useRouter();

    const handleAction = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsLoading(true);
        
        if (!product) {
             toast.error(t("product.messages.dataMissing"));
             setIsLoading(false);
             return;
        }

        try {
            if (product.type === 'subscription') {
                const result = await initiatePolarCheckout(product.id, locale);
                if (result.success && result.checkoutUrl) {
                    window.location.href = result.checkoutUrl;
                } else {
                    toast.error(t("product.messages.subscribeFailed"), {
                        description: result.message
                    });
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 300));
                addItem({ ...product, quantity: 1 });
                toast.success(t("product.messages.addedToCart"), {
                    description: product.name
                });
            }
        } catch (error: any) {
            console.error("Cart/Checkout Error:", error);
            toast.error(t("common.unexpectedError"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            type="button"
            disabled={isLoading}
            className={className} 
            size={size} 
            variant={variant}
            onClick={handleAction}
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>{t("common.loading")}</span>
                </>
            ) : children}
        </Button>
    );
}
