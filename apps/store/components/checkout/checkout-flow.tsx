"use client";


import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from "@repo/i18n";
import { useMoyasarForm } from '@void/payment/client';
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@repo/ui';
import { CreditCard, Banknote, Wallet, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { syncCartWithDB } from "@/app/actions/cart";
import { useCartStore } from "@/stores/cart-store";
import { CURRENCIES, PaymentProviderId, PaymentMethodId } from '@void/payment';
import { createPaymentIntentAction } from '@void/payment/actions';

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
  initialGateway?: PaymentProviderId;
  cartIdProp?: string;
  defaultCurrency?: string;
}

export function CheckoutFlow({ 
  userId, 
  initialGateway, 
  defaultCurrency = 'SAR' 
}: CheckoutFlowProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Store.checkout");
  
  const { 
    submitCard, 
    submitSTCPay, 
    submitSTCPayOTP,
    isLoading, 
    errors, 
    paymentError 
  } = useMoyasarForm();

  const { items: cartItems, totalPrice } = useCartStore();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
  const [cardData, setCardData] = useState({ name: '', number: '', cvc: '', month: '', year: '', save_card: false });
  const [mobile, setMobile] = useState('');
  
  const [showSTCOTP, setShowSTCOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [stcTxUrl, setStcTxUrl] = useState('');
  const [localError, setLocalError] = useState('');
  const [isVerifying] = useState(false);
  const [isPolarLoading, setIsPolarLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const activeGateway = initialGateway;
  
  const hasSubscription = isMounted && cartItems.some(i => i.type === 'subscription');
  const finalAmount = totalPrice();
  const currencyInfo = (CURRENCIES as any)[defaultCurrency] || CURRENCIES.SAR;

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
          const { cartId } = await syncCartWithDB(userId, undefined, cartItems);

          if (!cartId) {
              setLocalError(t("errors.prepareFailed"));
              return;
          }

          const callbackUrl = `${window.location.origin}/api/payment/callback?locale=${locale}`;
          let result;

          if (paymentMethod === 'card') {
              result = await submitCard(
                cardData,
                finalAmount * 100,
                currencyInfo.code,
                callbackUrl,
                { cartId, isRecurring: cardData.save_card }
              );
          } else if (paymentMethod === 'stcpay') {
              result = await submitSTCPay(
                mobile,
                finalAmount * 100,
                currencyInfo.code,
                callbackUrl,
                { cartId }
              );
          } else if (paymentMethod === 'applepay') {
              setLocalError(t("errors.applePayError"));
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
             router.push(`/${locale}/thank-you?id=${result.data.id}`);
          } else if (result?.status === 'error') {
              setLocalError(result.message);
          }
      } catch (err) {
          console.error(err);
          setLocalError(t("errors.genericError"));
      }
    }
  };

  const handleOTPSubmit = async () => {
    if (!otpValue || otpValue.length < 6) return;
    try {
        const callbackUrl = `${window.location.origin}/api/payment/callback?locale=${locale}`;
        const result = await submitSTCPayOTP(otpValue, stcTxUrl, callbackUrl);
        
        if (result?.status === 'success') {
            const finalRedirectUrl = `/api/payment/callback?id=${result.data.id}&status=paid&locale=${locale}`;
            window.location.href = finalRedirectUrl;
        } else if (result?.status === 'error') {
            setLocalError(result.message);
        }
    } catch (err) {
        setLocalError(t("errors.verificationFailed"));
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
                    <h3 className="text-xl font-bold">{t("payment.verifyMobile")}</h3>
                    <p className="text-muted-foreground text-sm">{t("payment.otpSent")} {mobile}</p>
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
                        {isLoading ? t("verifying") : t("payment.confirmOtp")}
                    </Button>
                    <button 
                        onClick={() => setShowSTCOTP(false)} 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                    >
                        {t("payment.changeMobile")}
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-start flex gap-3">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                        {t("payment.testModeNote")}
                    </p>
                </div>
            </div>
        </div>
    );
  }

  const handlePolarCheckout = async () => {
       setIsPolarLoading(true);
       try {
          const { cartId } = await syncCartWithDB(userId, undefined, cartItems);
          if (!cartId) {
             setLocalError(t("errors.prepareFailed"));
             setIsPolarLoading(false);
             return;
          }

          const callbackUrl = `${window.location.origin}/api/payment/callback?locale=${locale}&gateway=polar&checkout_id={CHECKOUT_ID}`; 
          
          const result = await createPaymentIntentAction('polar', {
             amount: finalAmount * 100,
             currency: 'USD', 
             description: `Order from ${userId || 'Guest'}`,
             callbackUrl,
             metadata: { cartId, userId }
          });

          if (result.status === 'success') {
             if (result.data.metadata?.checkoutUrl) {
                window.location.href = result.data.metadata.checkoutUrl;
             } else {
                setLocalError(t("errors.prepareFailed"));
                setIsPolarLoading(false);
             }
          } else {
             setLocalError(result.message || t("errors.genericError"));
             setIsPolarLoading(false);
          }
       } catch (err: any) {
           console.error(err);
           setLocalError(err.message || t("errors.genericError"));
           setIsPolarLoading(false);
       }
  };

  if (!activeGateway) {
    return (
       <div className="space-y-6 mt-8 animate-in fade-in">
            <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-100 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                   <Info className="h-8 w-8 text-red-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-red-700">{t("errors.paymentUnavailable")}</h3>
                    <p className="text-red-600/80">{t("errors.noProvider")}</p>
                </div>
            </div>
       </div>
    )
 }

  if (activeGateway === 'polar') {
     return (
        <div className="space-y-6 mt-8 animate-in fade-in">
             <div className="bg-primary/5 p-8 rounded-2xl border-2 border-primary/20 text-center space-y-6">
                 <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-primary" />
                 </div>
                 <div className="space-y-2">
                     <h3 className="text-xl font-bold">{t("payment.securePayment")}</h3>
                     <p className="text-muted-foreground">
                        {hasSubscription ? t("payment.subscriptionDesc") : t("payment.redirectDesc")}
                     </p>
                 </div>
                 
                  <Button 
                    onClick={handlePolarCheckout} 
                    className="w-full h-12 text-lg font-bold"
                    disabled={isPolarLoading}
                  >
                     {isPolarLoading ? t("processing") : t("payment.goToPayment")}
                  </Button>
                 
                 <div className="text-xs text-muted-foreground/50 pt-4 flex justify-center gap-4">
                    <span>Powered by Polar</span>
                    <span>Secure SSL</span>
                 </div>
             </div>
        </div>
     )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold border-b pb-4 text-start">{t("paymentMethod")}</h3>
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
                                <p className="font-semibold">{t("payment.card")}</p>
                                <p className="text-sm text-muted-foreground">{t("payment.cardDesc")}</p>
                            </div>
                        </div>
                        <input type="radio" checked={paymentMethod === 'card'} readOnly className="h-5 w-5 accent-primary" />
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-4 border-t space-y-6 animate-in fade-in slide-in-from-top-2">
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
                                              {(cards as any[]).map((card: any, idx: number) => (
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
                                <label className="text-sm font-medium mb-1.5 block">{t("payment.nameOnCard")}</label>
                                <input name="name" value={cardData.name} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background" placeholder="ALI ALSHEHRI" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1.5 block">{t("payment.cardNumber")}</label>
                                <input name="number" value={cardData.number} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background font-mono" placeholder="0000 0000 0000 0000" maxLength={16} />
                                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-sm font-medium mb-1.5 block">{t("payment.cvc")}</label>
                                    <input name="cvc" value={cardData.cvc} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background" placeholder="123" maxLength={4} />
                                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1.5 block">{t("payment.month")}</label>
                                    <input name="month" value={cardData.month} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background" placeholder="MM" maxLength={2} />
                                    {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1.5 block">{t("payment.year")}</label>
                                    <input name="year" value={cardData.year} onChange={handleInputChange} className="w-full border p-2.5 rounded-lg bg-background" placeholder="YY" maxLength={2} />
                                    {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                                  </div>
                              </div>
                              
                              <label className="flex items-center gap-3 cursor-pointer p-1 group">
                                  <input 
                                      type="checkbox" 
                                      name="save_card" 
                                      checked={cardData.save_card} 
                                      onChange={(e: any) => handleInputChange(e)}
                                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary" 
                                  />
                                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                      {t("payment.saveCard")}
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
                                <p className="font-semibold">{t("payment.stcpay")}</p>
                                <p className="text-sm text-muted-foreground">{t("payment.stcpayDesc")}</p>
                            </div>
                        </div>
                        <input type="radio" checked={paymentMethod === 'stcpay'} readOnly className="h-5 w-5 accent-primary" />
                    </div>

                    {paymentMethod === 'stcpay' && (
                        <div className="mt-4 pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2">
                             <div className="text-start">
                                <label className="text-sm font-medium mb-1.5 block">{t("payment.mobileNumber")}</label>
                                <input 
                                    type="text"
                                    value={mobile} 
                                    onChange={(e) => setMobile(e.target.value)} 
                                    className="w-full border p-2.5 rounded-lg bg-background font-mono" 
                                    placeholder="05xxxxxxxx" 
                                    maxLength={10} 
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">{t("payment.stcOtpDesc")}</p>
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
                                <p className="font-semibold">{t("payment.applepay")}</p>
                                <p className="text-sm text-muted-foreground">{t("payment.applepayDesc")}</p>
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
                        <p className="font-semibold">{t("buy")} {t("payment.cash")}</p>
                        <p className="text-sm text-muted-foreground">{t("payment.cashDesc")}</p>
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
         {isVerifying ? t("verifying") : (isLoading ? t("processing") : t("placeOrder"))}
       </Button>
    </div>
  );
}
