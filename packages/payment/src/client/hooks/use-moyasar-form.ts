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
});

export type CardData = z.infer<typeof CardSchema>;

export function useMoyasarForm() {
  const { pay, isLoading, error: paymentError } = usePayment();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: CardData) => {
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

  const submit = async (
    data: CardData,
    amount: number,
    currency: Currency,
    callbackUrl?: string,
    metadata?: any
  ): Promise<PaymentResult | null> => {
    if (!validate(data)) return null;

    return pay('moyasar', {
      amount,
      currency,
      description: 'Payment',
      callbackUrl: callbackUrl || window.location.href,
      metadata,
      source: {
        type: 'creditcard',
        name: data.name,
        number: data.number,
        cvc: data.cvc,
        month: data.month,
        year: data.year,
      },
    });
  };

  return {
    submit,
    isLoading,
    errors,
    paymentError,
  };
}
