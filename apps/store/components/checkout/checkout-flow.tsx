'use client';

import { useState, useEffect } from 'react';
import { useMoyasarForm } from '@void/payment/client';
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@repo/ui';
import { CreditCard, Banknote, Wallet, Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { syncCartWithDB } from "@/app/actions/cart";
import { useCartStore } from "@/stores/cart-store";

const TEST_CARDS = {
  mada: [
    { number: '4201320111111010', cvc: '123', status: 'paid', label: 'Approved' },
    { number: '4201320000013020', cvc: '123', status: 'failed', label: 'Unspecified Failure' },
    { number: '4201320000311101', cvc: '123', status: 'failed', label: 'Insufficient Funds' },
    { number: '4201320131000508', cvc: '123', status: 'failed', label: 'Lost Card' },
  ],
  visa: [
    { number: '4111111111111111', cvc: '123', status: 'paid', label: 'Approved' },
    { number: '4111114005765430', cvc: '123', status: 'paid', label: 'Frictionless Auth' },
    { number: '4123120000000000', cvc: '123', status: 'failed', label: 'Unspecified Failure' },
    { number: '4123120001090000', cvc: '123', status: 'failed', label: 'Insufficient Funds' },
  ],
  mastercard: [
    { number: '5421080101000000', cvc: '123', status: 'paid', label: 'Approved' },
    { number: '5105105105105100', cvc: '123', status: 'failed', label: 'Unspecified Failure' },
    { number: '5457210001000092', cvc: '123', status: 'failed', label: 'Insufficient Funds' },
  ],
  amex: [
    { number: '340000000900000', cvc: '1234', status: 'paid', label: 'Approved' },
    { number: '371111111111114', cvc: '1234', status: 'failed', label: 'Unspecified Failure' },
    { number: '340033000000000', cvc: '1234', status: 'failed', label: 'Insufficient Funds' },
  ]
};

export function CheckoutFlow({ translations, locale, amount: initialAmount = 0, userId }: { translations: any, locale: string, amount?: number, userId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submit, isLoading, errors, paymentError } = useMoyasarForm();
  
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
    month: '12',
    year: '28',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const fillTestCard = (number: string, cvc: string) => {
    setCardData({
      ...cardData,
      name: 'ALI ALSHEHRI',
      number,
      cvc,
      month: '12',
      year: '28'
    });
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      try {
          // 1. Sync Cart with DB first to ensure we have a persistent record
          const { cartId } = await syncCartWithDB(userId, undefined, cartItems);

          if (!cartId) {
              setLocalError('Failed to prepare checkout');
              return;
          }

          // 2. Submit Payment with Cart ID in metadata (Order will be created on success)
          const callbackUrl = `${window.location.origin}/api/payment/callback?locale=${locale}`;
          
          const result = await submit(
              cardData, 
              finalAmount * 100, 
              'SAR', 
              callbackUrl,
              { cartId } // Pass cartId instead of orderId
          ); 
          
          if (result?.status === 'success') {
             if (result.data.status === 'INITIATED' && result.data.metadata?.source?.transaction_url) {
                window.location.href = result.data.metadata.source.transaction_url;
                return;
             }
             // For synchronous success, Order creation will be handled by the verification logic
             router.push(`/${locale}/thank-you?id=${result.data.id}`);
          } else if (result?.status === 'error') {
              setLocalError(result.message);
          }
      } catch (err) {
          console.error(err);
          setLocalError('An error occurred during payment');
      }
    } else {
        // Cash or Apple Pay logic (Future)
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold border-b pb-4 text-start">{translations["checkout.paymentMethod"]}</h3>
            <div className="grid grid-cols-1 gap-4">
                
                {/* Credit Card */}
                <div 
                  className={`flex flex-col border p-4 rounded-xl transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:bg-muted/5 cursor-pointer'}`}
                  onClick={() => paymentMethod !== 'card' && setPaymentMethod('card')}
                >
                    <div className="flex items-center space-x-4 space-x-reverse justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-start">
                                <p className="font-semibold">بطاقة مدى / ائتمانية</p>
                                <p className="text-sm text-muted-foreground">دفع آمن و سريع</p>
                            </div>
                        </div>
                        <input type="radio" checked={paymentMethod === 'card'} readOnly className="h-5 w-5 accent-primary" />
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-4 border-t space-y-6 animate-in fade-in slide-in-from-top-2">
                          
                          {/* Test Cards Helper */}
                          <div className="bg-muted/20 p-4 rounded-xl border border-dashed text-start">
                              <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                  <Info className="size-4" />
                                  <span className="text-xs font-bold uppercase tracking-wider">Test Cards Helper</span>
                              </div>
                              <Tabs defaultValue="mada" className="w-full">
                                  <TabsList className="grid w-full grid-cols-4 mb-4" variant="line">
                                      <TabsTrigger value="mada">Mada</TabsTrigger>
                                      <TabsTrigger value="visa">Visa</TabsTrigger>
                                      <TabsTrigger value="mastercard">Master</TabsTrigger>
                                      <TabsTrigger value="amex">AMEX</TabsTrigger>
                                  </TabsList>
                                  
                                  {Object.entries(TEST_CARDS).map(([scheme, cards]) => (
                                      <TabsContent key={scheme} value={scheme} className="space-y-2 mt-0">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                              {cards.map((card, idx) => (
                                                  <button
                                                      key={idx}
                                                      type="button"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          fillTestCard(card.number, card.cvc);
                                                      }}
                                                      className="flex items-center justify-between p-2.5 rounded-lg border bg-background hover:border-primary transition-all text-start group"
                                                  >
                                                      <div className="space-y-0.5">
                                                          <p className="text-[11px] font-mono font-bold tracking-tighter opacity-80 decoration-primary/30 group-hover:decoration-primary group-hover:underline">
                                                              {card.number.replace(/(.{4})/g, '$1 ')}
                                                          </p>
                                                          <p className="text-[10px] text-muted-foreground">{card.label}</p>
                                                      </div>
                                                      <Badge variant={card.status === 'paid' ? 'default' : 'destructive'} className="text-[9px] h-4 px-1 leading-none uppercase">
                                                          {card.status}
                                                      </Badge>
                                                  </button>
                                              ))}
                                          </div>
                                      </TabsContent>
                                  ))}
                              </Tabs>
                          </div>

                          <div className="grid grid-cols-1 gap-4 text-start">
                              <div>
                                <label className="text-sm font-medium mb-1.5 block">الاسم على البطاقة</label>
                                <input name="name" value={cardData.name} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background" placeholder="ALI ALSHEHRI" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1.5 block">رقم البطاقة</label>
                                <input name="number" value={cardData.number} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background font-mono" placeholder="0000 0000 0000 0000" maxLength={16} />
                                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-sm font-medium mb-1.5 block">رمز (CVC)</label>
                                    <input name="cvc" value={cardData.cvc} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background" placeholder="123" maxLength={4} />
                                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1.5 block">الشهر</label>
                                    <input name="month" value={cardData.month} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background" placeholder="MM" maxLength={2} />
                                    {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1.5 block">السنة</label>
                                    <input name="year" value={cardData.year} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background" placeholder="YY" maxLength={2} />
                                    {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                                  </div>
                              </div>
                          </div>
                      </div>
                    )}
                </div>
                
                {/* Other Methods */}
                <div 
                  onClick={() => setPaymentMethod('applepay')}
                  className={`flex items-center space-x-4 space-x-reverse border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors ${paymentMethod === 'applepay' ? 'border-primary bg-primary/5' : ''}`}
                >
                    <div className="bg-orange-100 p-2 rounded-lg">
                        <Wallet className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1 text-start">
                        <p className="font-semibold">Apple Pay</p>
                        <p className="text-sm text-muted-foreground">ادفع بلمسة واحدة</p>
                    </div>
                    <input type="radio" checked={paymentMethod === 'applepay'} readOnly className="h-5 w-5 accent-primary" />
                </div>

                <div 
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center space-x-4 space-x-reverse border p-4 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : ''}`}
                >
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Banknote className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 text-start">
                        <p className="font-semibold">{translations["buy"] || "دفع"} عند الاستلام</p>
                        <p className="text-sm text-muted-foreground">ادفع نقداً عند وصول طلبك</p>
                    </div>
                    <input type="radio" checked={paymentMethod === 'cash'} readOnly className="h-5 w-5 accent-primary" />
                </div>
            </div>
      </div>

      {(paymentError || localError) && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 text-start">
          {paymentError || localError}
        </div>
      )}

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
