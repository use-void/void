import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from '@repo/i18n';
import { ShippingForm } from '@/components/checkout/shipping-form';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { getSession } from '@void/auth';
import { CheckoutFlow } from '@/components/checkout/checkout-flow';

export default async function CheckoutPage({ 
    params 
}: { 
    params: Promise<{ locale: string }> 
}) {
    const { locale } = await params;
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
    translations 
}: { 
    locale: string, 
    translations: any 
}) {
    const session = await getSession();
    return (
        <CheckoutFlow 
            locale={locale} 
            translations={translations}
            amount={0} 
            userId={session?.user?.id}
        />
    );
}
