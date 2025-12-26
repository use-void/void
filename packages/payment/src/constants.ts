
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

export const PAYMENT_STATUS_MAP = {
  MOYASAR: {
    paid: 'PAID',
    failed: 'FAILED',
    authorized: 'AUTHORIZED',
    captured: 'PAID',
  },
  POLAR: {
    succeeded: 'PAID',
    confirmed: 'PAID',
    failed: 'FAILED',
  }
} as const;
