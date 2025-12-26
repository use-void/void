'use client';

import { useState } from 'react';
import { z } from 'zod';
import { usePayment } from './use-payment';
import { PaymentResult, Currency } from '../../core/types';

// Client-side validation for card data
export const CardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  number: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),
  month: z.string().regex(/^\d{1,2}$/, 'Invalid month'),
  year: z.string().regex(/^\d{2,4}$/, 'Invalid year'),
  save_card: z.boolean().optional(),
});

export type CardData = z.infer<typeof CardSchema>;

export function useMoyasarForm() {
  const { pay, isLoading, error: paymentError } = usePayment();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCard = (data: CardData) => {
    const result = CardSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0] as string] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const submitCard = async (
    data: CardData,
    amount: number,
    currency: Currency,
    callbackUrl?: string,
    metadata?: any
  ): Promise<PaymentResult | null> => {
    if (!validateCard(data)) return null;

    return pay('moyasar', {
      amount,
      currency,
      description: 'Card Payment',
      callbackUrl: callbackUrl || window.location.href,
      metadata,
      source: {
        type: 'creditcard',
        name: data.name,
        number: data.number,
        cvc: data.cvc,
        month: data.month,
        year: data.year,
        save_card: data.save_card as any,
      },
    });
  };

  const submitSTCPay = async (
    mobile: string,
    amount: number,
    currency: Currency,
    callbackUrl?: string,
    metadata?: any
  ): Promise<PaymentResult | null> => {
    if (!mobile || !mobile.match(/^05\d{8}$/)) {
      setErrors({ mobile: 'يرجى إدخال رقم جوال صحيح (05xxxxxxxx)' });
      return null;
    }

    return pay('moyasar', {
      amount,
      currency,
      description: 'STC Pay Payment',
      callbackUrl: callbackUrl || window.location.href,
      metadata,
      source: {
        type: 'stcpay',
        mobile,
      },
    });
  };

  const submitApplePay = async (
    token: string,
    amount: number,
    currency: Currency,
    callbackUrl?: string,
    metadata?: any
  ): Promise<PaymentResult | null> => {
    return pay('moyasar', {
      amount,
      currency,
      description: 'Apple Pay Payment',
      callbackUrl: callbackUrl || window.location.href,
      metadata,
      source: {
        type: 'applepay',
        token,
      },
    });
  };

  const submitSTCPayOTP = async (
    otp: string,
    transactionUrl: string,
    callbackUrl?: string
  ): Promise<PaymentResult | null> => {
    if (!otp || otp.length < 6) {
      setErrors({ otp: 'يرجى إدخال رمز التحقق بشكل صحيح' });
      return null;
    }

    try {
      const response = await fetch(transactionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          otp_value: otp,
        }),
      });

      const data = await response.json();
      
      // If payment is paid, we return success with mapped data
      if (data.status === 'paid' || data.status === 'captured') {
        return {
          status: 'success',
          data: {
            id: data.id,
            status: 'PAID',
            amount: data.amount,
            currency: data.currency,
            rawResponse: data
          } as any
        };
      } else if (data.status === 'failed') {
        return {
          status: 'error',
          code: 'PAYMENT_FAILED',
          message: data.source?.message || 'فشل عملية الدفع',
        };
      }
      
      return {
        status: 'error',
        code: 'UNKNOWN',
        message: 'حالة الدفع غير معروفة',
      };
    } catch (err: any) {
      console.error('STC Pay OTP Error:', err);
      return {
        status: 'error',
        code: 'NETWORK_ERROR',
        message: 'حدث خطأ أثناء الاتصال',
      };
    }
  };

  return {
    submit: submitCard, 
    submitCard,
    submitSTCPay,
    submitSTCPayOTP,
    submitApplePay,
    isLoading,
    errors,
    paymentError,
  };
}
