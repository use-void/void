import { getSession } from "@void/auth";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { getTranslations } from '@repo/i18n';

export async function CheckoutContent({ locale }: { locale: string }) {
    const session = await getSession();
    const t = await getTranslations('Store.checkout');

    return (
        <CheckoutFlow 
            locale={locale} 
            translations={t.raw('paymentMethod') ? {
                "checkout.paymentMethod": t('paymentMethod'),
                "checkout.placeOrder": t('placeOrder'),
                "buy": t.raw('buy') || "Buy"
            } : {
                "checkout.paymentMethod": "Payment Method",
                "checkout.placeOrder": "Place Order",
                "buy": "Buy"
            }}
            userId={session?.user?.id}
        />
    );
}
