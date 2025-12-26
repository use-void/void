import { BasePaymentProvider } from '../base';
import { CreatePaymentOptions, PaymentResult, Transaction } from '../../../core/types';
import { PolarConfigSchema } from './types';
import { mapPolarTransaction } from './mapper';
import { Polar } from '@polar-sh/sdk';

export class PolarProvider extends BasePaymentProvider {
  name = 'polar';
  private polar!: Polar;

  protected validateConfig(): void {
    const parsed = PolarConfigSchema.safeParse(this.config);
    if (!parsed.success) {
      throw new Error(`Invalid Polar config: ${parsed.error.message}`);
    }
    
    // Initialize Polar SDK
    // Based on standard SDK patterns. 
    // If accessToken is provided, use it. Some SDKs might require it in constructor.
    this.polar = new Polar({
      accessToken: parsed.data.accessToken,
      server: process.env.POLAR_ENV === 'sandbox' ? 'sandbox' : 'production', 
    });
  }

  async authorize(options: CreatePaymentOptions): Promise<PaymentResult> {
    try {
      // Create a checkout session using SDK
      // Metadata needs to include polar product IDs for this to work with strict SDK
      const productIds = options.metadata?.polarProductIds 
        ? (Array.isArray(options.metadata.polarProductIds) ? options.metadata.polarProductIds : [options.metadata.polarProductIds])
        : [];
      
      // Clean metadata: Remove internal arrays, Polar only accepts flat primitives
      const { polarProductIds, ...cleanMetadata } = options.metadata || {};
      
      const session = await this.polar.checkouts.create({
          amount: options.amount,
          // currency: options.currency, 
          products: productIds,
          successUrl: options.callbackUrl,
          metadata: cleanMetadata,
      });

      // Map response
      const transaction = mapPolarTransaction(session);
      
      if (session.url) {
        transaction.metadata = { ...transaction.metadata, checkoutUrl: session.url };
      }
      
      return this.success(transaction);
    } catch (e: any) {
      console.error('Polar SDK Error:', e);
      return this.error('AUTHORIZE_FAILED', e.message || 'Polar authorization failed', e);
    }
  }

  async capture(transactionId: string, amount?: number): Promise<PaymentResult> {
    return this.verify(transactionId);
  }

  async refund(transactionId: string, amount?: number, reason?: string): Promise<PaymentResult> {
    return this.error('REFUND_NOT_IMPLEMENTED', 'Polar refund not implemented via SDK yet');
  }

  async void(transactionId: string): Promise<PaymentResult> {
    return this.error('VOID_NOT_IMPLEMENTED', 'Polar void not supported');
  }

  async verify(transactionId: string): Promise<PaymentResult> {
    try {
      const session = await this.polar.checkouts.get({
        id: transactionId
      });
      return this.success(mapPolarTransaction(session));
    } catch (e: any) {
      return this.error('VERIFY_FAILED', e.message, e);
    }
  }

  async verifyWebhook(request: Request): Promise<boolean> {
    return true; 
  }

  async parseWebhook(body: any): Promise<Transaction> {
    if (body.data) {
        return mapPolarTransaction(body.data);
    }
    return mapPolarTransaction(body);
  }
}
