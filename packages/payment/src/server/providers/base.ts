import { IPaymentProvider, PaymentResult, CreatePaymentOptions, Transaction } from '../../core/types';
import { PaymentError } from '../../core/errors';
import 'server-only';

export abstract class BasePaymentProvider implements IPaymentProvider {
  protected config: Record<string, any> = {};

  abstract name: string;

  initialize(config: Record<string, any>): void {
    this.config = config;
    this.validateConfig();
  }

  protected validateConfig(): void {
    // Override to validate required keys
  }

  abstract authorize(options: CreatePaymentOptions): Promise<PaymentResult>;
  abstract capture(transactionId: string, amount?: number): Promise<PaymentResult>;
  abstract refund(transactionId: string, amount?: number, reason?: string): Promise<PaymentResult>;
  abstract void(transactionId: string): Promise<PaymentResult>;
  abstract verify(transactionId: string): Promise<PaymentResult>;

  abstract verifyWebhook(request: Request): Promise<boolean>;
  abstract parseWebhook(body: any): Promise<Transaction>;

  protected success(data: Transaction): PaymentResult {
    return { status: 'success', data };
  }

  protected error(code: string, message: string, raw?: any): PaymentResult {
    return { status: 'error', code, message, raw };
  }
}
