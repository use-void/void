'use client';

import { useState } from 'react';
import { PaymentProviderId } from '../../constants';
import { CreatePaymentOptions, PaymentResult } from '../../core/types';
import { createPaymentIntentAction } from '../../server/actions';

export interface UsePaymentReturn {
  isLoading: boolean;
  error: string | null;
  pay: (provider: PaymentProviderId, options: CreatePaymentOptions) => Promise<PaymentResult>;
}

export function usePayment(): UsePaymentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async (provider: PaymentProviderId, options: CreatePaymentOptions): Promise<PaymentResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createPaymentIntentAction(provider, options);
      
      if (result.status === 'error') {
        setError(result.message);
      }
      
      return result;
    } catch (err: any) {
      const msg = err.message || 'Payment failed';
      setError(msg);
      return { status: 'error', code: 'UNKNOWN', message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    pay,
  };
}
