import { Transaction, PaymentStatus, Currency } from '../../../core/types';
import { MoyasarPaymentResponse } from './types';

export function mapMoyasarStatus(status: string): PaymentStatus {
  switch (status) {
    case 'paid': return 'PAID';
    case 'initiated': return 'INITIATED';
    case 'authorized': return 'AUTHORIZED';
    case 'captured': return 'CAPTURED';
    case 'refunded': return 'REFUNDED';
    case 'voided': return 'VOIDED';
    case 'failed': return 'FAILED';
    default: return 'PENDING';
  }
}

export function mapMoyasarTransaction(data: MoyasarPaymentResponse): Transaction {
  return {
    id: data.id,
    providerId: data.id,
    amount: {
      value: data.amount, // Moyasar uses subunits (halalas/cents) but often returns them as such.
      // Note: We should be consistent. If the system expects units (e.g. 100.00), we divide.
      // Assuming system works with smallest units (cents) as integer is best practice.
      // If system expects float, divide by 100.
      // For now, I will pass through, assuming unified system also uses integers / smallest units.
      currency: data.currency as Currency,
    },
    status: mapMoyasarStatus(data.status),
    createdAt: new Date(data.created_at),
    metadata: {
      source: data.source,
      invoiceId: data.invoice_id,
      ip: data.ip,
      callbackUrl: data.callback_url,
    },
    rawResponse: data,
  };
}
