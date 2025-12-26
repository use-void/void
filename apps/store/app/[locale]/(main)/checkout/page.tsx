import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from '@repo/i18n';
import { ShippingForm } from '@/components/checkout/shipping-form';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { getSession } from '@void/auth';
import { CheckoutFlow } from '@/components/checkout/checkout-flow';
import { getCartById, getCart } from '@/app/actions/cart'; // Adjust import if needed
import { Product, connectToDatabase } from '@void/db';
import { getPaymentConfig } from '@/app/actions/config';
import { resolveActiveGateway } from '@void/payment';

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

    await connectToDatabase();
    
    // 1. Get Store/Payment Config
    const config = await getPaymentConfig();
    
    // 2. Gateway Logic
    const activeGateway = resolveActiveGateway({
        isMoyasarEnabled: config.moyasar.isEnabled,
        isPolarEnabled: config.polar.isEnabled
    });

    // 3. Try to find the cart
    let resolvedCartId = cartId;
    let cart: any = null;
    if (cartId) {
        cart = await getCartById(cartId);
    } 
    
    if (!cart && userId) {
        cart = await getCart(userId, undefined);
        resolvedCartId = cart?._id?.toString();
    }

    return (
        <CheckoutFlow 
            locale={locale} 
            translations={translations}
            userId={userId}
            initialGateway={activeGateway}
            cartIdProp={resolvedCartId}
            defaultCurrency={config.defaultCurrency}
        />
    );
}
