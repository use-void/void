"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCartStore, CartItem } from "@/stores/cart-store";
import { initiatePolarCheckout } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
    children: React.ReactNode;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    product?: Omit<CartItem, 'quantity'>;
    locale?: string;
}

export function AddToCartButton({ 
    children, 
    className,
    size = "default",
    variant = "default",
    product,
    locale = "ar"
}: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const router = useRouter();

    const handleAction = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsLoading(true);
        
        if (!product) {
             toast.error(locale === 'ar' ? "فشل العملية (بيانات مفقودة)" : "Action failed (data missing)");
             setIsLoading(false);
             return;
        }

        try {
            if (product.type === 'subscription') {
                // Subscription Flow: Direct Checkout
                const result = await initiatePolarCheckout(product.id, locale);
                if (result.success && result.checkoutUrl) {
                    window.location.href = result.checkoutUrl;
                } else {
                    toast.error(locale === 'ar' ? "فشل بدء الاشتراك" : "Failed to initiate subscription", {
                        description: result.message
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 500)); // UX delay
                addItem({ ...product, quantity: 1 });
                toast.success(locale === 'ar' ? "تمت إضافة المنتج إلى السلة" : "Product added to cart", {
                    description: product.name
                });
            }
        } catch (error: any) {
            console.error("Cart/Checkout Error:", error);
            toast.error(locale === 'ar' ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
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
                    <span>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
                </>
            ) : children}
        </Button>
    );
}
