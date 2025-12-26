import { z } from 'zod';

export const MoyasarConfigSchema = z.object({
  secretKey: z.string().min(1),
  publishableKey: z.string().min(1).optional(),
});

export type MoyasarConfig = z.infer<typeof MoyasarConfigSchema>;

export const MoyasarPaymentSourceSchema = z.object({
  type: z.enum(['creditcard', 'stcpay', 'applepay']),
  company: z.string().optional(),
  name: z.string(),
  number: z.string().optional(), // masked
  message: z.string().optional(),
});

export const MoyasarPaymentSchema = z.object({
  id: z.string(),
  status: z.enum(['initiated', 'paid', 'failed', 'authorized', 'captured', 'refunded', 'voided']),
  amount: z.number(),
  amount_format: z.string(),
  fee: z.number(),
  currency: z.string(),
  description: z.string().optional().nullable(),
  invoice_id: z.string().optional().nullable(),
  ip: z.string().optional().nullable(),
  callback_url: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  source: MoyasarPaymentSourceSchema,
});

export type MoyasarPaymentResponse = z.infer<typeof MoyasarPaymentSchema>;
