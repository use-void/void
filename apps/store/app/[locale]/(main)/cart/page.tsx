import { setRequestLocale } from '@repo/i18n';
import { CartItemsList } from '@/components/cart/cart-items-list';
import { CartSummary } from '@/components/cart/cart-summary';
import { FeaturedProducts } from '@/components/home/featured-products';
import { Suspense } from 'react';
import { Skeleton } from '@repo/ui';

export default async function CartPage({ 
    params 
}: { 
    params: Promise<{ locale: string }> 
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16">
                <div className="lg:col-span-8">
                    <CartItemsList />
                </div>
                <div className="lg:col-span-4 lg:relative">
                    <CartSummary />
                </div>
            </div>
            
            <div className="mt-24 border-t pt-16">
                <Suspense fallback={<div className="container mx-auto px-4 md:px-6 py-12"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}</div></div>}>
                    <FeaturedProducts locale={locale} />
                </Suspense>
            </div>
        </div>
    );
}
