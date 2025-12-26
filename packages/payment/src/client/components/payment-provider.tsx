'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { usePayment, UsePaymentReturn } from '../hooks/use-payment';

const PaymentContext = createContext<UsePaymentReturn | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const payment = usePayment();

  return (
    <PaymentContext.Provider value={payment}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentContext() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
}
