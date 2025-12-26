import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from '@repo/i18n';
import { ShippingForm } from '@/components/checkout/shipping-form';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { getSession } from '@void/auth';
import { CheckoutFlow } from '@/components/checkout/checkout-flow';
import { getCartById, getCart } from '@/app/actions/cart'; // Adjust import if needed
import { Product, connectToDatabase } from '@void/db';

export default async function CheckoutPage({ 
    params,
    searchParams
}: { 
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ cartId?: string }>;
}) {
    const { locale } = await params;
    // Do NOT await searchParams here to avoid blocking route error
    
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "Store" });

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl font-bold mb-8 text-center md:text-right">{t("checkout.title")}</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-background rounded-2xl border p-6 md:p-8 shadow-sm">
                        <ShippingForm locale={locale} />
                        {/* We now use the CheckoutFlow for payment methods and submission */}
                        <Suspense fallback={<div className="p-8 text-center">Loading payment form...</div>}>
                            <CheckoutFormWrapper 
                                locale={locale} 
                                searchParams={searchParams}
                                translations={{
                                    "checkout.paymentMethod": t("checkout.paymentMethod"),
                                    "checkout.placeOrder": t("checkout.placeOrder"),
                                    "buy": t("buy")
                                }}
                            />
                        </Suspense>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <CheckoutSummary />
                </div>
            </div>
        </div>
    );
}

async function CheckoutFormWrapper({ 
    locale, 
    searchParams,
    translations 
}: { 
    locale: string, 
    searchParams: Promise<{ cartId?: string }>,
    translations: any 
}) {
    const { cartId } = await searchParams; // Await inside Suspense boundary

    const session = await getSession();
    const userId = session?.user?.id;

    // Server-Side Gateway Logic
    let activeGateway: 'moyasar' | 'polar' = 'moyasar'; // Default
    let resolvedCartId = cartId;

    await connectToDatabase();

    // 1. Try to find the cart
    let cart: any = null;
    if (cartId) {
        cart = await getCartById(cartId);
    } 
    
    if (!cart && userId) {
        // Fallback: If no param, try getting user's active cart
        cart = await getCart(userId, undefined);
        resolvedCartId = cart?._id?.toString();
    }

    // 2. Analyze Product Types
    if (cart && cart.items && cart.items.length > 0) {
        const productIds = cart.items.map((item: any) => item.productId);
        const products = await (Product as any).find({ _id: { $in: productIds } }).select('type').lean();
        
        const hasDigital = products.some((p: any) => p.type === 'digital' || p.type === 'subscription');
        
        if (hasDigital) {
            activeGateway = 'polar';
        }
    }

    return (
        <CheckoutFlow 
            locale={locale} 
            translations={translations}
            userId={userId}
            initialGateway={activeGateway}
            cartIdProp={resolvedCartId}
        />
    );
}
