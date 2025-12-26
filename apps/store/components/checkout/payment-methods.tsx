import { getTranslations } from "@repo/i18n";
import { CreditCard, Banknote, Wallet } from "lucide-react";

export async function PaymentMethods({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "Store" });

    return (
        <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold border-b pb-4">{t("checkout.paymentMethod")}</h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 space-x-reverse border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">بطاقة مدى / ائتمانية</p>
                        <p className="text-sm text-muted-foreground">دفع آمن و سريع</p>
                    </div>
                    <input type="radio" name="payment" value="card" className="h-5 w-5 accent-primary" defaultChecked />
                </div>
                
                <div className="flex items-center space-x-4 space-x-reverse border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <div className="bg-orange-100 p-2 rounded-lg">
                        <Wallet className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Apple Pay</p>
                        <p className="text-sm text-muted-foreground">ادفع بلمسة واحدة</p>
                    </div>
                    <input type="radio" name="payment" value="applepay" className="h-5 w-5 accent-primary" />
                </div>

                <div className="flex items-center space-x-4 space-x-reverse border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Banknote className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{t("buy")} عند الاستلام</p>
                        <p className="text-sm text-muted-foreground">ادفع نقداً عند وصول طلبك</p>
                    </div>
                    <input type="radio" name="payment" value="cash" className="h-5 w-5 accent-primary" />
                </div>
            </div>
        </div>
    );
}
