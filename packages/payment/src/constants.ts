
export const PAYMENT_PROVIDERS = {
  moyasar: {
    id: 'moyasar',
    name: 'Moyasar',
    capabilities: ['one-time'],
    countries: ['SA', 'AE', 'KW'],
    requiresShipping: true,
    currencies: ['SAR', 'AED', 'KWD'],
    icon: 'credit-card',
    color: 'primary',
  },
  polar: {
    id: 'polar',
    name: 'Polar',
    capabilities: ['subscription', 'digital'],
    countries: 'global',
    requiresShipping: false,
    currencies: ['USD', 'EUR'],
    icon: 'wallet',
    color: 'orange',
  },
  cash: {
    id: 'cash',
    name: 'Cash on Delivery',
    capabilities: ['one-time'],
    countries: ['SA'],
    requiresShipping: true,
    currencies: ['SAR'],
    icon: 'banknote',
    color: 'green',
  }
} as const;

export type PaymentProviderId = keyof typeof PAYMENT_PROVIDERS;

export type PaymentMethodId = 'card' | 'stcpay' | 'applepay' | 'cash';

export type TransactionStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED' | 'VOIDED';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export const PAYMENT_STATUS_MAP: Record<string, Record<string, TransactionStatus>> = {
  MOYASAR: {
    paid: 'PAID',
    failed: 'FAILED',
    authorized: 'AUTHORIZED',
    captured: 'PAID',
    refunded: 'REFUNDED',
    voided: 'VOIDED',
  },
  POLAR: {
    succeeded: 'PAID',
    confirmed: 'PAID',
    failed: 'FAILED',
    refunded: 'REFUNDED',
  }
} as const;

export const CURRENCIES = {
  SAR: { code: 'SAR', symbol: 'ر.س', decimals: 2 },
  USD: { code: 'USD', symbol: '$', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', decimals: 2 },
  AED: { code: 'AED', symbol: 'د.إ', decimals: 2 },
  KWD: { code: 'KWD', symbol: 'د.ك', decimals: 3 },
} as const;
