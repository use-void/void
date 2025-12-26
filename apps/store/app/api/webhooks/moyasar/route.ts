import { PaymentFactory } from '@void/payment/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // In a real app, initialize provider with config to verify signature
    // For now, we manually assume it's Moyasar based on URL or body structure
    // const provider = PaymentFactory.getProvider('moyasar', { ... });
    // await provider.verifyWebhook(request);
    
    // For verification purpose only:
    console.log('Webhook Received:', JSON.stringify(rawBody, null, 2));

    // Here you would:
    // 1. Get transaction ID from body
    // 2. Update Order status in Database (void/db)
    
    return NextResponse.json({ status: 'received' });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 400 });
  }
}
