export class PaymentError extends Error {
  public code: string;
  public raw?: any;

  constructor(message: string, code: string = 'PAYMENT_ERROR', raw?: any) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.raw = raw;
  }
}

export class ProviderConfigurationError extends PaymentError {
  constructor(message: string) {
    super(message, 'CONFIGURATION_ERROR');
    this.name = 'ProviderConfigurationError';
  }
}

export class TransactionFailedError extends PaymentError {
  constructor(message: string, raw?: any) {
    super(message, 'TRANSACTION_FAILED', raw);
    this.name = 'TransactionFailedError';
  }
}
