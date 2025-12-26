import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from '@repo/i18n';
import { buttonVariants } from '@repo/ui';
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from '@repo/i18n/navigation';
import { connectToDatabase, PaymentTransaction, Order } from '@void/db';
import { ClearCart } from '@/components/cart/clear-cart';

async function ThankYouDetails({ 
    searchParamsPromise, 
    locale 
}: { 
    searchParamsPromise: Promise<{ id?: string }>, 
    locale: string 
}) {
    const searchParams = await searchParamsPromise;
    const txId = searchParams.id;
    const t = await getTranslations({ locale, namespace: "Store" });
    
    await connectToDatabase();
    
    // Fetch transaction and order info
    const tx = txId ? await (PaymentTransaction as any).findOne({ providerTransactionId: txId }) : null;
    const order = tx?.orderId ? await (Order as any).findById(tx.orderId) : null;

    const orderNumber = order?.orderNumber || "ORD-PENDING";
    const total = order?.financials?.total || (tx?.amount ? tx.amount / 100 : 0);
    const currencyLabel = locale === 'ar' ? 'ر.س' : 'SAR';

    return (
        <div className="max-w-md mx-auto space-y-8">
            <ClearCart />
            <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
            </div>
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">{t("checkout.success")}</h1>
                <p className="text-muted-foreground text-lg">
                    {locale === 'ar' 
                        ? `رقم طلبك هو ` 
                        : `Your order number is `}
                    <span className="font-bold text-foreground">#{orderNumber}</span>. 
                    {locale === 'ar'
                        ? ` ستتلقى بريداً إلكترونياً بتفاصيل التأكيد والشحن قريباً.`
                        : ` You will receive an email confirmation soon.`}
                </p>
            </div>

            <div className="p-6 bg-muted/20 rounded-2xl border text-start space-y-3">
                <h3 className="font-bold border-b pb-2 mb-4">{t("checkout.orderSummary")}</h3>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                    <span>{total} {currencyLabel}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.shipping")}</span>
                    <span className="text-green-600">{t("checkout.freeShipping")}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>{t("cart.total")}</span>
                    <span className="text-primary">{total} {currencyLabel}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                    href="/account" 
                    className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-8 rounded-xl" })}
                >
                    <ShoppingBag className="me-2 h-5 w-5" />
                    {locale === 'ar' ? 'تتبع طلباتي' : 'Track My Orders'}
                </Link>
                <Link 
                    href="/" 
                    className={buttonVariants({ size: "lg", className: "h-12 px-8 rounded-xl" })}
                >
                    {t("cart.continueShopping")}
                    <ArrowRight className="ms-2 h-5 w-5" />
                </Link>
            </div>
        </div>
    );
}

function ThankYouLoading() {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">جاري تأكيد طلبك...</p>
        </div>
    );
}

export default async function ThankYouPage({ 
    params,
    searchParams: searchParamsPromise
}: { 
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ id?: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <Suspense fallback={<ThankYouLoading />}>
                <ThankYouDetails searchParamsPromise={searchParamsPromise} locale={locale} />
            </Suspense>
        </div>
    );
}
