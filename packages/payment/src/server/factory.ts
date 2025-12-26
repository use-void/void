import { IPaymentProvider } from '../core/types';
import { MoyasarProvider } from './providers/moyasar';
import { PaymentProviderId } from '../constants';

// type ProviderName = 'moyasar' | 'stripe' | 'tabby' | 'tamara' | 'polar';

export class PaymentFactory {
  private static instances: Map<string, IPaymentProvider> = new Map();

  static register(name: string, provider: IPaymentProvider) {
    this.instances.set(name, provider);
  }

  static getProvider(name: PaymentProviderId, config: Record<string, any>): IPaymentProvider {
    let provider = this.instances.get(name);
    
    if (!provider) {
       switch (name) {
           case 'moyasar':
               provider = new MoyasarProvider();
               break;
           case 'polar':
               const { PolarProvider } = require('./providers/polar');
               provider = new PolarProvider();
               break;
            // Future providers
           default:
               throw new Error(`Provider ${name} not supported`);
       }
    }
    
    if (!provider) {
        throw new Error(`Failed to initialize provider ${name}`);
    }

    // Re-initialize with config (careful with singleton pattern if config changes per request)
    // For per-request config, we might need a new instance or a context-aware provider.
    // Given the request mentions "Server Actions", usually we read Env Vars.
    // So let's instantiate new one to be safe and avoiding shared state pollution across requests if config varies.
    // Or we keep instances if config is static (env vars).
    // Assuming config comes from args.
    
    provider.initialize(config);
    return provider;
  }
}
