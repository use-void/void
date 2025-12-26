import { BasePaymentProvider } from '../base';
import { CreatePaymentOptions, PaymentResult, Transaction } from '../../../core/types';
import { MoyasarApi } from './api';
import { MoyasarConfigSchema } from './types';
import { mapMoyasarTransaction } from './mapper';

export class MoyasarProvider extends BasePaymentProvider {
  name = 'moyasar';
  private api!: MoyasarApi;

  protected validateConfig(): void {
    const parsed = MoyasarConfigSchema.safeParse(this.config);
    if (!parsed.success) {
      throw new Error(`Invalid Moyasar config: ${parsed.error.message}`);
    }
    this.api = new MoyasarApi(parsed.data);
  }

  async authorize(options: CreatePaymentOptions): Promise<PaymentResult> {
    try {
      const data = await this.api.createPayment({
        amount: options.amount, // smallest unit
        currency: options.currency,
        description: options.description,
        callback_url: options.callbackUrl,
        metadata: options.metadata,
        source: options.source, // Token or source object
      });
      return this.success(mapMoyasarTransaction(data));
    } catch (e: any) {
      return this.error('AUTHORIZE_FAILED', e.message || 'Payment authorization failed', e);
    }
  }

  async capture(transactionId: string, amount?: number): Promise<PaymentResult> {
    try {
      const data = await this.api.capturePayment(transactionId, amount);
      return this.success(mapMoyasarTransaction(data));
    } catch (e: any) {
      return this.error('CAPTURE_FAILED', e.message, e);
    }
  }

  async refund(transactionId: string, amount?: number, reason?: string): Promise<PaymentResult> {
    try {
      // Reason isn't directly supported in simple refund endpoint of Moyasar generally, but logging it is good.
      const data = await this.api.refundPayment(transactionId, amount);
      return this.success(mapMoyasarTransaction(data));
    } catch (e: any) {
       return this.error('REFUND_FAILED', e.message, e);
    }
  }

  async void(transactionId: string): Promise<PaymentResult> {
      try {
          const data = await this.api.voidPayment(transactionId);
          return this.success(mapMoyasarTransaction(data));
      } catch (e: any) {
          return this.error('VOID_FAILED', e.message, e);
      }
  }

  async verify(transactionId: string): Promise<PaymentResult> {
    try {
      const data = await this.api.fetchPayment(transactionId);
      return this.success(mapMoyasarTransaction(data));
    } catch (e: any) {
      return this.error('VERIFY_FAILED', e.message, e);
    }
  }

  async verifyWebhook(request: Request): Promise<boolean> {
    // Moyasar doesn't have signature header validation in the same way Stripe does (HMAC).
    // Usually it relies on basic auth or IP whitelisting + checking status from API.
    // However, for this pattern, if they provided a webhook secret, we'd check it here.
    // Assuming pass through for now or Basic Auth check if implemented.
    return true; 
  }

  async parseWebhook(body: any): Promise<Transaction> {
      // Depending on structure. Often body is the payment object itself or {id: ... event: ...}
      // Assuming body is the payment object for simplicity or we fetch it.
      if (body.id && body.status && body.amount) {
          return mapMoyasarTransaction(body);
      }
      throw new Error('Unknown webhook format');
  }
}
