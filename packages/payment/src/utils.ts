import { CURRENCIES, PaymentProviderId } from './constants';

/**
 * Formats a price based on currency code and locale.
 * Uses the CURRENCIES constant for symbols and decimals.
 */
export function formatPrice(
    amount: number, 
    currencyCode: string = 'SAR', 
    locale: string = 'en',
    showSymbol: boolean = true
): string {
    const currency = (CURRENCIES as any)[currencyCode] || CURRENCIES.SAR;
    const value = amount.toLocaleString(locale, {
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals,
    });
    
    if (!showSymbol) return value;
    
    // Arabic: Symbol after (e.g., 100 ر.س)
    // English: Code before or symbol (e.g., SAR 100 or $100)
    return locale === 'ar' 
        ? `${value} ${currency.symbol}` 
        : `${currency.code} ${value}`;
}

/**
 * Determines the active gateway based on store configuration and product types.
 */
export function resolveActiveGateway(
    config: { 
        isMoyasarEnabled: boolean; 
        isPolarEnabled: boolean; 
    },
    hasSubscription: boolean = false
): PaymentProviderId | undefined {
    // Priority: 
    // 1. If has subscription, must use Polar IF enabled.
    // 2. Otherwise, if Moyasar enabled, use Moyasar (local preference).
    // 3. Else if Polar enabled, use Polar.
    
    if (hasSubscription && config.isPolarEnabled) {
        return 'polar';
    }
    
    if (config.isMoyasarEnabled) {
        return 'moyasar';
    }
    
    if (config.isPolarEnabled) {
        return 'polar';
    }
    
    return undefined;
}

/**
 * Checks if a currency is supported by a provider.
 */
export function isCurrencySupported(provider: PaymentProviderId, currency: string): boolean {
    const supported: Record<PaymentProviderId, string[]> = {
        moyasar: ['SAR', 'USD', 'EUR', 'AED', 'KWD'], // Common Moyasar currencies
        polar: ['USD', 'EUR', 'GBP'], // Polar usually more global/USD focused
        cash: ['SAR']
    };
    
    return supported[provider]?.includes(currency) ?? false;
}
