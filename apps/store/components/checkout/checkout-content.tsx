import { getSession } from "@void/auth";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { getTranslations } from '@repo/i18n';

export async function CheckoutContent({ locale }: { locale: string }) {
    const session = await getSession();
    const t = await getTranslations('Store.checkout');

    return (
        <CheckoutFlow 
            locale={locale} 
            translations={{
                "checkout.paymentMethod": t('paymentMethod'),
                "checkout.placeOrder": t('placeOrder'),
                "buy": t('buy')
            }}
            userId={session?.user?.id}
        />
    );
}
