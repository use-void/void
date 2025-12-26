import { ofetch } from 'ofetch';
import { MoyasarConfig, MoyasarPaymentResponse } from './types';
import { ProviderConfigurationError } from '../../../core/errors';

export class MoyasarApi {
  private secretKey: string;
  private baseUrl = 'https://api.moyasar.com/v1';

  constructor(config: MoyasarConfig) {
    if (!config.secretKey) {
      throw new ProviderConfigurationError('Moyasar secretKey is required');
    }
    this.secretKey = config.secretKey;
  }

  private async request<T>(path: string, options: any = {}): Promise<T> {
    const auth = Buffer.from(this.secretKey + ':').toString('base64');
    
    return ofetch<T>(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createPayment(data: any): Promise<MoyasarPaymentResponse> {
    return this.request<MoyasarPaymentResponse>('/payments', {
      method: 'POST',
      body: data,
    });
  }

  async fetchPayment(id: string): Promise<MoyasarPaymentResponse> {
    return this.request<MoyasarPaymentResponse>(`/payments/${id}`, {
      method: 'GET',
    });
  }

  async capturePayment(id: string, amount?: number): Promise<MoyasarPaymentResponse> {
     const body = amount ? { amount } : {};
     return this.request<MoyasarPaymentResponse>(`/payments/${id}/capture`, {
        method: 'POST',
        body,
     });
  }

  async refundPayment(id: string, amount?: number): Promise<MoyasarPaymentResponse> {
      const body = amount ? { amount } : {};
      return this.request<MoyasarPaymentResponse>(`/payments/${id}/refund`, {
        method: 'POST',
        body,
      });
  }

  async voidPayment(id: string): Promise<MoyasarPaymentResponse> {
      return this.request<MoyasarPaymentResponse>(`/payments/${id}/void`, {
        method: 'POST',
      });
  }
}
