import { Transaction, PaymentStatus } from '../../../core/types';

export function mapPolarTransaction(data: any): Transaction {
  // Mapping Polar status to system status
  let status: PaymentStatus = 'PENDING';
  
  if (data.status === 'succeeded' || data.payment_status === 'paid') {
    status = 'PAID';
  } else if (data.status === 'failed') {
    status = 'FAILED';
  }

  return {
    id: data.id,
    providerId: data.id,
    amount: {
      value: data.amount_total || data.amount || 0,
      currency: (data.currency || 'USD').toUpperCase() as any,
    },
    currency: (data.currency || 'USD').toUpperCase(),
    status,
    createdAt: new Date(data.created_at || Date.now()),
    reference: data.id,
    paymentMethodType: 'polar_checkout',
    metadata: data.metadata,
    rawResponse: data,
    timeline: [
      {
        status,
        date: new Date(),
        message: `Polar status: ${data.status}`
      }
    ]
  };
}
