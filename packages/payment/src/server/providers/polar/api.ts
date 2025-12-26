import { ofetch } from 'ofetch';
import { PolarConfig } from './types';
import { ProviderConfigurationError } from '../../../core/errors';

export class PolarApi {
  private accessToken: string;
  private baseUrl = 'https://sandbox-api.polar.sh/v1';

  constructor(config: PolarConfig) {
    if (!config.accessToken) {
      throw new ProviderConfigurationError('Polar accessToken is required');
    }
    this.accessToken = config.accessToken;
  }

  private async request<T>(path: string, options: any = {}): Promise<T> {
    return ofetch<T>(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Polar primarily uses Checkouts. 
  // For 'authorize', we might be creating a checkout session.
  async createCheckout(data: any): Promise<any> {
    return this.request('/checkouts/custom', { // Hypothetical endpoint, verified later
      method: 'POST',
      body: data,
    });
  }

  async getCheckout(id: string): Promise<any> {
    return this.request(`/checkouts/custom/${id}`, {
      method: 'GET',
    });
  }
}
