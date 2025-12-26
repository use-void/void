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

export function mapMoyasarTransaction(raw: MoyasarPaymentResponse): Transaction {
    const status = mapMoyasarStatus(raw.status);

    const timeline = raw.updated_at ? [
        { status: status, date: new Date(raw.updated_at), message: raw.source.message || `Status updated to ${raw.status}` }
    ] : [];

    // Extract card details or wallet info
    let cardDetails;
    let paymentMethodType = raw.source.type;
    
    if (raw.source.type === 'creditcard') {
        cardDetails = {
            brand: raw.source.company || 'unknown',
            scheme: raw.source.company || 'card',
            last4: raw.source.number ? raw.source.number.slice(-4) : '****',
            name: raw.source.name
        };
    } else if (raw.source.type === 'applepay' || raw.source.type === 'stcpay') {
        paymentMethodType = raw.source.type;
    }

    return {
        id: raw.id,
        providerId: raw.id, // standardized
        status: status,
        amount: {
            value: raw.amount,
            currency: raw.currency as Currency
        },
        currency: raw.currency,
        createdAt: new Date(raw.created_at), // legacy/standardized
        description: raw.description || '',
        metadata: {
            ...(raw as any).metadata,
            ip: raw.ip,
            callbackUrl: raw.callback_url
        },
        reference: (raw as any).reference,
        responseCode: (raw as any).response_code,
        gatewayId: (raw as any).gateway_id,
        terminalId: (raw as any).terminal_id,
        failureReason: raw.status === 'failed' ? raw.source.message : undefined,
        cardDetails,
        paymentMethodType,
        tokenId: (raw as any).token_id,
        cartId: (raw as any).metadata?.cartId, // Added root mapping
        orderId: (raw as any).metadata?.orderId, // Added root mapping
        timeline,
        rawResponse: raw
    };
}
