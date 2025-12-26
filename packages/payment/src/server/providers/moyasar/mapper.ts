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
  const status = mapMoyasarStatus(data.status);

  return {
    id: data.id,
    providerId: data.id,
    amount: {
      value: data.amount,
      currency: data.currency as Currency,
    },
    status: status,
    createdAt: new Date(data.created_at),
    
    reference: (data.source as any)?.reference_number,
    responseCode: (data.source as any)?.response_code,
    gatewayId: (data.source as any)?.gateway_id,
    terminalId: (data.source as any)?.terminal_id,
    failureReason: data.status === 'failed' ? (data.source as any)?.message : undefined,
    
    cardDetails: {
        brand: (data as any).source?.company,
        scheme: (data as any).source?.type, // e.g. mada
        last4: (data as any).source?.number?.slice(-4),
        name: (data as any).source?.name
    },

    timeline: [{
        status: status,
        date: new Date(data.created_at),
        message: (data as any).source?.message || `Transaction ${status}`
    }],

    metadata: {
      source: data.source,
      invoiceId: data.invoice_id,
      ip: data.ip,
      callbackUrl: data.callback_url,
    },
    rawResponse: data,
  };
}
