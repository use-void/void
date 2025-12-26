import { z } from 'zod';

export const PolarConfigSchema = z.object({
  accessToken: z.string().min(1),
  organizationId: z.string().optional(),
});

export type PolarConfig = z.infer<typeof PolarConfigSchema>;

export interface PolarCheckoutSession {
  id: string;
  url: string;
  status: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  customer_email?: string;
  customer_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface PolarPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  // Add other fields as needed based on Polar API
}
