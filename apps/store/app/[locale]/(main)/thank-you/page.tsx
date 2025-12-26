import { setRequestLocale, getTranslations } from '@repo/i18n';
import { Button, buttonVariants } from '@repo/ui';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from '@repo/i18n/navigation';

export default async function ThankYouPage({ 
    params 
}: { 
    params: Promise<{ locale: string }> 
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "Store" });

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <div className="max-w-md mx-auto space-y-8">
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle2 className="h-16 w-16 text-green-600" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">{t("checkout.success")}</h1>
                    <p className="text-muted-foreground text-lg">
                        رقم طلبك هو <span className="font-bold text-foreground">#ORD-9430</span>. ستتلقى بريداً إلكترونياً بتفاصيل التأكيد والشحن قريباً.
                    </p>
                </div>

                <div className="p-6 bg-muted/20 rounded-2xl border text-right space-y-3">
                    <h3 className="font-bold border-b pb-2 mb-4">{t("checkout.orderSummary")}</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                        <span>697 ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("cart.shipping")}</span>
                        <span className="text-green-600">{t("checkout.freeShipping")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>{t("cart.total")}</span>
                        <span className="text-primary">697 ر.س</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/account" 
                        className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-8 rounded-xl" })}
                    >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        تتبع طلباتي
                    </Link>
                    <Link 
                        href="/" 
                        className={buttonVariants({ size: "lg", className: "h-12 px-8 rounded-xl" })}
                    >
                        متابعة التسوق
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
