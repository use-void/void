'use client';

import { useState, useEffect } from 'react';
import { useMoyasarForm } from '@void/payment/client';
import { Button } from '@repo/ui';
import { CreditCard, Banknote, Wallet } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { createOrder } from "@/app/actions/checkout";
import { useCartStore } from "@/stores/cart-store";

export function CheckoutFlow({ translations, locale, amount: initialAmount = 0, userId }: { translations: any, locale: string, amount?: number, userId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submit, isLoading, errors, paymentError } = useMoyasarForm();
  
  // Get real amount from store
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const finalAmount = cartTotal > 0 ? cartTotal : initialAmount;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'cash'>('card');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isVerifying] = useState(false);
  
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    cvc: '',
    month: '',
    year: '',
  });

  useEffect(() => {

  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      try {
          // 1. Create Order
          const { orderId } = await createOrder({
              userId,
              items: cartItems,
              amount: finalAmount,
              currency: 'SAR'
          });

          // 2. Submit Payment with Order ID in metadata
          const callbackUrl = `${window.location.origin}/api/payment/callback?locale=${locale}`;
          
          const result = await submit(
              cardData, 
              finalAmount * 100, 
              'SAR', 
              callbackUrl,
              { orderId } // Metadata passed to payment provider
          ); 
          
          if (result?.status === 'success') {
             if (result.data.status === 'INITIATED' && result.data.metadata?.source?.transaction_url) {
                window.location.href = result.data.metadata.source.transaction_url;
                return;
             }
             
             router.push(`/${locale}/thank-you?id=${result.data.id}`);
          } else if (result?.status === 'error') {
              setLocalError(result.message);
          }
      } catch (err) {
          console.error(err);
          setLocalError('Failed to create order');
      }
    } else {
    }
  };

  return (
    <div className="space-y-8">
      {/* Payment Methods Selection */}
      <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold border-b pb-4">{translations["checkout.paymentMethod"]}</h3>
            <div className="grid grid-cols-1 gap-4">
                
                {/* Credit Card */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}
                >
                    <div className="flex items-center space-x-4 space-x-reverse justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">بطاقة مدى / ائتمانية</p>
                                <p className="text-sm text-muted-foreground">دفع آمن و سريع</p>
                            </div>
                        </div>
                        <input type="radio" checked={paymentMethod === 'card'} readOnly className="h-5 w-5 accent-primary" />
                    </div>

                    {/* Card Inputs - Only show if Card is selected */}
                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2">
                          <div>
                            <label className="text-sm font-medium mb-1 block">الاسم على البطاقة</label>
                            <input name="name" value={cardData.name} onChange={handleInputChange} className="w-full border p-2 rounded-md" placeholder="الاسم كما يظهر على البطاقة" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">رقم البطاقة</label>
                            <input name="number" value={cardData.number} onChange={handleInputChange} className="w-full border p-2 rounded-md" placeholder="0000 0000 0000 0000" maxLength={16} />
                            {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">رمز التحقق (CVC)</label>
                                <input name="cvc" value={cardData.cvc} onChange={handleInputChange} className="w-full border p-2 rounded-md" placeholder="123" maxLength={4} />
                                {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">الشهر</label>
                                <input name="month" value={cardData.month} onChange={handleInputChange} className="w-full border p-2 rounded-md" placeholder="MM" maxLength={2} />
                                {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">السنة</label>
                                <input name="year" value={cardData.year} onChange={handleInputChange} className="w-full border p-2 rounded-md" placeholder="YY" maxLength={2} />
                                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                              </div>
                          </div>
                      </div>
                    )}
                </div>
                
                {/* Apple Pay */}
                <div 
                  onClick={() => setPaymentMethod('applepay')}
                  className={`flex items-center space-x-4 space-x-reverse border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors ${paymentMethod === 'applepay' ? 'border-primary bg-primary/5' : ''}`}
                >
                    <div className="bg-orange-100 p-2 rounded-lg">
                        <Wallet className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Apple Pay</p>
                        <p className="text-sm text-muted-foreground">ادفع بلمسة واحدة</p>
                    </div>
                    <input type="radio" checked={paymentMethod === 'applepay'} readOnly className="h-5 w-5 accent-primary" />
                </div>

                {/* Cash */}
                <div 
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center space-x-4 space-x-reverse border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : ''}`}
                >
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Banknote className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{translations["buy"] || "دفع"} عند الاستلام</p>
                        <p className="text-sm text-muted-foreground">ادفع نقداً عند وصول طلبك</p>
                    </div>
                    <input type="radio" checked={paymentMethod === 'cash'} readOnly className="h-5 w-5 accent-primary" />
                </div>
            </div>
      </div>

      {(paymentError || localError) && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {paymentError || localError}
        </div>
      )}

      {/* Place Order Button */}
       {/* Use a Portal or just place it here if the layout permits. 
           The original layout had the button in the sidebar. 
           For this refactor, we are focusing on the flow. 
           We can inject the button via a Slot or just pass the handler up if needed. 
           For now, let's put the main button here for clarity or instruction.
       */}
       
       {/* Actually, the prompt implies replacing the whole flow. 
           But the sidebar button is 'Place Order'. 
           We should probably move the button to be part of this Flow 
           OR make the sidebar button a child of this form. 
           
           For simplicity, I will render the submit button HERE inside the grid if possible, 
           or user has to move internal logic.
           
           Let's assume the Sidebar Logic is separate. 
           To verify, I will Render a BIG "PAY NOW" button here.
       */}
       <Button 
         onClick={handlePlaceOrder} 
         className="w-full h-12 text-lg font-bold"
         disabled={isLoading || isVerifying}
       >
         {isVerifying ? 'جاري التحقق...' : (isLoading ? 'جاري المعالجة...' : translations["checkout.placeOrder"])}
       </Button>
    </div>
  );
}
