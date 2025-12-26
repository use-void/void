import { z } from 'zod';

export type Currency = 'SAR' | 'USD' | 'EUR';

export interface PaymentAmount {
  value: number;
  currency: Currency;
}

export type PaymentStatus = 
  | 'INITIATED'
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'VOIDED';

export interface Transaction {
  id: string;
  providerId: string;
  amount: PaymentAmount;
  status: PaymentStatus;
  createdAt: Date;
  metadata?: Record<string, any>;
  rawResponse?: any;
}

export interface CreatePaymentOptions {
  amount: number;
  currency: Currency;
  description: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
  source?: any; // Token or payment source
}

// Discriminator Union for standardized responses
export type PaymentResult = 
  | { status: 'success'; data: Transaction }
  | { status: 'error'; code: string; message: string; raw?: any };

export interface IPaymentProvider {
  name: string;
  
  initialize(config: Record<string, any>): void;
  
  // Creates a charge/authorization
  authorize(options: CreatePaymentOptions): Promise<PaymentResult>;
  
  // Captures a previously authorized payment
  capture(transactionId: string, amount?: number): Promise<PaymentResult>;
  
  // Refunds a payment
  refund(transactionId: string, amount?: number, reason?: string): Promise<PaymentResult>;
  
  // Voids an authorization
  void(transactionId: string): Promise<PaymentResult>;

  // Verifies/Fetches a transaction status
  verify(transactionId: string): Promise<PaymentResult>;
  
  // Verifies a webhook signature
  verifyWebhook(request: Request): Promise<boolean>;
  
  // Parses webhook body to unified Transaction
  parseWebhook(body: any): Promise<Transaction>;
}
