import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentAction } from '@void/payment/actions';
import { connectToDatabase, Cart, PaymentTransaction } from '@void/db';
import { createOrder } from "@/app/actions/checkout";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, metadata } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        // 1. Verify Payment (to be safe and updated in DB)
        const verifyResult = await verifyPaymentAction('moyasar', id);
        
        if (verifyResult.status !== 'success') {
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }

        const txData = verifyResult.data;
        const { status: txStatus, cartId, amount, currency, orderId: existingOrderId } = txData as any;

        // 2. Only proceed if paid and NO order exists yet
        if ((txStatus === 'PAID' || txStatus === 'CAPTURED') && cartId && !existingOrderId) {
            await connectToDatabase();
            
            const cart = await (Cart as any).findById(cartId);
            if (cart && cart.status === 'active') {
                const orderResult = await createOrder({
                    userId: cart.userId?.toString(),
                    items: cart.items,
                    amount: amount.value / 100,
                    currency: currency,
                    paymentMethod: 'card'
                });

                if (orderResult.success) {
                    cart.status = 'converted';
                    await cart.save();

                    await (PaymentTransaction as any).updateOne(
                        { providerTransactionId: id } as any,
                        { orderId: orderResult.orderId }
                    );
                    
                    console.log(`Webhook: Order ${orderResult.orderId} created for transaction ${id}`);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
