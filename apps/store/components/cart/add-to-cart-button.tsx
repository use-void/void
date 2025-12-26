"use client";

import { useState } from "react";
import { Button, cn } from "@repo/ui";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCartStore, CartItem } from "@/stores/cart-store";

interface AddToCartButtonProps {
    children: React.ReactNode;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    product?: Omit<CartItem, 'quantity'>; // Pass product details
}

export function AddToCartButton({ 
    children, 
    className,
    size = "default",
    variant = "default",
    product
}: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsLoading(true);
        
        // Simulate network delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (product) {
            addItem({ ...product, quantity: 1 });
            console.log("Added to cart:", product);
            toast.success("تمت إضافة المنتج إلى السلة بنجاح", {
                description: product.name
            });
        } else {
             // Fallback for when product prop isn't passed yet (during refactor)
             console.warn("Product details missing in AddToCartButton");
             toast.error("فشل إضافة المنتج (بيانات مفقودة)");
        }
        
        setIsLoading(false);
    };

    return (
        <Button 
            type="button"
            disabled={isLoading}
            className={className} 
            size={size} 
            variant={variant}
            onClick={handleAddToCart}
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>جاري الإضافة...</span>
                </>
            ) : children}
        </Button>
    );
}
