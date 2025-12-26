import { getTranslations } from "@repo/i18n";
import { CreditCard, Banknote, Wallet, LucideIcon } from "lucide-react";
import { PAYMENT_PROVIDERS, PaymentProviderId } from "@void/payment";

const ICON_MAP: Record<string, LucideIcon> = {
    'credit-card': CreditCard,
    'wallet': Wallet,
    'banknote': Banknote,
};

const COLOR_MAP: Record<string, string> = {
    'primary': 'text-primary bg-primary/10',
    'orange': 'text-orange-600 bg-orange-100',
    'green': 'text-green-600 bg-green-100',
};

export async function PaymentMethods({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "Store" });

    // In a real scenario, we might filter these based on cart content (Checkout Guard)
    const providers = Object.values(PAYMENT_PROVIDERS);

    return (
        <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold border-b pb-4">{t("checkout.paymentMethod")}</h3>
            <div className="grid grid-cols-1 gap-4">
                {providers.map((provider, index) => {
                    const Icon = ICON_MAP[provider.icon] || CreditCard;
                    const colorClass = COLOR_MAP[provider.color] || 'text-primary bg-primary/10';
                    const [textColor, bgColor] = colorClass.split(' ');

                    return (
                        <div 
                            key={provider.id}
                            className="flex items-center space-x-4 space-x-reverse border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                        >
                            <div className={`${bgColor} p-2 rounded-lg`}>
                                <Icon className={`h-6 w-6 ${textColor}`} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">
                                    {provider.id === 'cash' ? `${t("buy")} ${t(`checkout.payment.${provider.id}`)}` : t(`checkout.payment.${provider.id}`)}
                                </p>
                                <p className="text-sm text-muted-foreground">{t(`checkout.payment.${provider.id}Desc`)}</p>
                            </div>
                            <input 
                                type="radio" 
                                name="payment" 
                                value={provider.id} 
                                className="h-5 w-5 accent-primary" 
                                defaultChecked={index === 0} 
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
