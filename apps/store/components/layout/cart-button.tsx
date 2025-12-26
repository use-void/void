'use client';

import { Link } from '@repo/i18n/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useEffect, useState } from 'react';

export function CartButton() {
    const items = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <Link href="/cart" className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {mounted && itemCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center font-bold animate-in zoom-in-50 duration-300">
                    {itemCount}
                </span>
            )}
        </Link>
    );
}
