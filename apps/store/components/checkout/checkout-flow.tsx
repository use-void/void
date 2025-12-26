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

interface CheckoutFlowProps {
  amount?: number;
  locale: string;
  translations: any;
  userId?: string;
  initialGateway?: 'moyasar' | 'polar';
  cartIdProp?: string;
}

export function CheckoutFlow({ amount, locale, translations, userId, initialGateway, cartIdProp }: CheckoutFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { 
    submitCard, 
    submitSTCPay, 
    submitSTCPayOTP,
    submitApplePay, 
    isLoading, 
    errors, 
    paymentError 
  } = useMoyasarForm();

  const { items: cartItems, clearCart, totalPrice } = useCartStore();
  
  // State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'stcpay' | 'applepay' | 'cash'>('card');
  const [cardData, setCardData] = useState({ name: '', number: '', cvc: '', month: '', year: '', save_card: false });
  const [mobile, setMobile] = useState('');
  
  // UI State: Using Moyasar hook's loading/errors essentially, but we have local overrides too if needed
  const [showSTCOTP, setShowSTCOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [stcTxUrl, setStcTxUrl] = useState('');
  const [localError, setLocalError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false); // Restored

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Gateway logic: Trust server -> Fallback to client
  // We need these flags for UI logic as well (e.g. showing "Subscribe" text)
  const hasSubscription = isMounted && cartItems.some(i => i.type === 'subscription');
  const hasDigital = isMounted && cartItems.some(i => i.type === 'digital');

  const clientHasPolarItems = hasSubscription || hasDigital;
  const clientShouldUsePolar = clientHasPolarItems && cartItems.length > 0;
  
  const activeGateway = initialGateway ?? (clientShouldUsePolar ? 'polar' : 'moyasar');
  
  const finalAmount = totalPrice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCardData({ ...cardData, [e.target.name]: value });
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
    if (paymentMethod === 'card' || paymentMethod === 'applepay' || paymentMethod === 'stcpay') {
      try {
          // 1. Sync Cart with DB first to ensure we have a persistent record
          const { cartId } = await syncCartWithDB(userId, undefined, cartItems);

          if (!cartId) {
              setLocalError('Failed to prepare checkout');
              return;
          }

          // 2. Submit Payment based on method
          const callbackUrl = `${window.location.origin}/api/payment/callback?locale=${locale}`;
          let result;

          if (paymentMethod === 'card') {
              result = await submitCard(
                cardData,
                finalAmount * 100,
                'SAR',
                callbackUrl,
                { cartId, isRecurring: cardData.save_card }
              );
          } else if (paymentMethod === 'stcpay') {
              result = await submitSTCPay(
                mobile,
                finalAmount * 100,
                'SAR',
                callbackUrl,
                { cartId }
              );
          } else if (paymentMethod === 'applepay') {
              // Apple Pay usually requires a token from the browser session
              setLocalError('Apple Pay integration requires further configuration on this device');
              return;
          }
          
          if (result?.status === 'success') {
             const transactionUrl = result.data.rawResponse?.source?.transaction_url;
             
             if (result.data.status === 'INITIATED' && transactionUrl) {
                if (paymentMethod === 'stcpay') {
                    setStcTxUrl(transactionUrl);
                    setShowSTCOTP(true);
                    return;
                }
                window.location.href = transactionUrl;
                return;
             }
             // For synchronous success
             router.push(`/${locale}/thank-you?id=${result.data.id}`);
          } else if (result?.status === 'error') {
              setLocalError(result.message);
          }
      } catch (err) {
          console.error(err);
          setLocalError('An error occurred during payment');
      }
    } else {
        // Cash logic
    }
  };

  const handleOTPSubmit = async () => {
    if (!otpValue || otpValue.length < 6) return;
    try {
        const callbackUrl = `${window.location.origin}/api/payment/callback?locale=${locale}`;
        const result = await submitSTCPayOTP(otpValue, stcTxUrl, callbackUrl);
        
        if (result?.status === 'success') {
            // Redirect to the callback route to trigger order creation
            const callbackUrl = `/api/payment/callback?id=${result.data.id}&status=paid&locale=${locale}`;
            window.location.href = callbackUrl;
        } else if (result?.status === 'error') {
            setLocalError(result.message);
        }
    } catch (err) {
        setLocalError('فشل التحقق من الرمز');
    }
  };

  if (showSTCOTP) {
    return (
        <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/20 text-center space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Info className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">التحقق من رقم الجوال</h3>
                    <p className="text-muted-foreground text-sm">تم إرسال رمز التحقق إلى رقم جوالك {mobile}</p>
                </div>
                
                <div className="pt-4 max-w-xs mx-auto">
                    <input 
                        type="text" 
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        className="w-full text-center text-2xl font-bold tracking-[0.5em] border-2 p-3 rounded-xl focus:border-primary outline-none"
                        placeholder="000000"
                        maxLength={6}
                    />
                    {errors.otp && <p className="text-red-500 text-xs mt-2">{errors.otp}</p>}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button onClick={handleOTPSubmit} className="w-full h-12 text-lg font-bold" disabled={isLoading}>
                        {isLoading ? 'جاري التحقق...' : 'تأكيد الرمز'}
                    </Button>
                    <button 
                        onClick={() => setShowSTCOTP(false)} 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                    >
                        تغيير رقم الجوال
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-start flex gap-3">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                        ملاحظة: في وضع التجربة، يمكنك استخدام الرمز <span className="font-bold underline">123456</span> لإتمام العملية بنجاح.
                    </p>
                </div>
            </div>
        </div>
    );
  }

  const handlePolarCheckout = async () => {
       try {
          const { cartId } = await syncCartWithDB(userId, undefined, cartItems);
          if (!cartId) {
             setLocalError('Failed to sync cart');
             return;
          }

          // We append {CHECKOUT_ID} template so Polar replaces it with the actual ID on success
          const callbackUrl = `${window.location.origin}/api/payment/callback?locale=${locale}&gateway=polar&checkout_id={CHECKOUT_ID}`; 
          
          // Import dynamically or use the action passed as prop/imported
          const { createPaymentIntentAction } = await import('@void/payment/actions');
          
          const result = await createPaymentIntentAction('polar', {
             amount: finalAmount * 100,
             currency: 'USD', // Polar usually USD or global currencies. Double check if SAR supported. Assuming USD for digital.
             description: `Order from ${userId || 'Guest'}`,
             callbackUrl,
             metadata: {
                cartId,
                userId
             }
          });

          if (result.status === 'success') {
             if (result.data.metadata?.checkoutUrl) {
                window.location.href = result.data.metadata.checkoutUrl;
             } else {
                setLocalError('Checkout URL missing from provider');
             }
          } else {
             setLocalError(result.message || 'Failed to initiate Polar checkout');
          }

       } catch (err: any) {
           console.error(err);
           setLocalError(err.message || 'Error initializing checkout');
       }
  };

  if (activeGateway === 'polar') {
     return (
        <div className="space-y-6 mt-8 animate-in fade-in">
             <div className="bg-primary/5 p-8 rounded-2xl border-2 border-primary/20 text-center space-y-6">
                 <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-primary" />
                 </div>
                 <div className="space-y-2">
                     <h3 className="text-xl font-bold">إتمام الدفع الآمن</h3>
                     <p className="text-muted-foreground">
                        {hasSubscription ? 'اشتراكك يتطلب دفع دوري آمن.' : 'سيتم تحويلك لصفحة الدفع المشفرة.'}
                     </p>
                 </div>
                 
                 <Button onClick={handlePolarCheckout} className="w-full h-12 text-lg font-bold">
                    الذهاب للدفع
                 </Button>
                 
                 <div className="text-xs text-muted-foreground/50 pt-4 flex justify-center gap-4">
                    <span>Powered by Polar</span>
                    <span>Secure SSL</span>
                 </div>
             </div>
        </div>
     )
  }

  // Legacy Moyasar Flow for Physical Products
  return (
    <div className="space-y-8">
      <div className="space-y-6 mt-8">
            {/* Header and existing Moyasar UI */}
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
                                <p className="text-sm text-muted-foreground">دفع آمن و سريع (للمنتجات المادية)</p>
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
                              
                              {/* Save Card Option for Tokenization */}
                              <label className="flex items-center gap-3 cursor-pointer p-1 group">
                                  <input 
                                      type="checkbox" 
                                      name="save_card" 
                                      checked={cardData.save_card} 
                                      onChange={(e: any) => handleInputChange(e)}
                                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary" 
                                  />
                                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                      حفظ بيانات البطاقة للمشتريات القادمة
                                  </span>
                              </label>
                          </div>
                      </div>
                    )}
                </div>
                
                {/* STC Pay */}
                <div 
                   onClick={() => setPaymentMethod('stcpay')}
                   className={`flex flex-col border p-4 rounded-xl transition-all duration-200 ${paymentMethod === 'stcpay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/5 cursor-pointer'}`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#4F2D7F]/10 p-2 rounded-lg">
                                <Badge variant="outline" className="bg-[#4F2D7F] text-white border-none text-[10px] py-0 px-1.5 h-4 mb-0.5">STC Pay</Badge>
                            </div>
                            <div className="text-start">
                                <p className="font-semibold">STC Pay</p>
                                <p className="text-sm text-muted-foreground">الدفع المباشر برقم الجوال</p>
                            </div>
                        </div>
                        <input type="radio" checked={paymentMethod === 'stcpay'} readOnly className="h-5 w-5 accent-primary" />
                    </div>

                    {paymentMethod === 'stcpay' && (
                        <div className="mt-4 pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2">
                             <div className="text-start">
                                <label className="text-sm font-medium mb-1.5 block">رقم الجوال المرتبط بـ STC Pay</label>
                                <input 
                                    type="text"
                                    value={mobile} 
                                    onChange={(e) => setMobile(e.target.value)} 
                                    className="w-full border p-2.5 rounded-lg bg-background font-mono" 
                                    placeholder="05xxxxxxxx" 
                                    maxLength={10} 
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">سيتم إرسال رمز التحقق (OTP) إلى جوالك بعد الضغط على "إتمام الطلب"</p>
                                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Apple Pay */}
                <div 
                  onClick={() => setPaymentMethod('applepay')}
                   className={`flex flex-col border p-4 rounded-xl transition-all duration-200 ${paymentMethod === 'applepay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/5 cursor-pointer'}`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="bg-black p-2 rounded-lg">
                                <Wallet className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-start">
                                <p className="font-semibold">Apple Pay</p>
                                <p className="text-sm text-muted-foreground">دفع آمن عبر iPhone / Mac</p>
                            </div>
                        </div>
                        <input type="radio" checked={paymentMethod === 'applepay'} readOnly className="h-5 w-5 accent-primary" />
                    </div>
                </div>

                {/* Cash */}
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
