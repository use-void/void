import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentAction } from '@void/payment/actions';
import { connectToDatabase, Cart, PaymentTransaction, Order } from '@void/db';
import { createOrder } from "@/app/actions/checkout";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        // 1. Verify Payment (this updates our DB status automatically via verifyPaymentAction)
        const verifyResult = await verifyPaymentAction('moyasar', id);
        
        if (verifyResult.status !== 'success') {
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }

        const txData = verifyResult.data;
        const { status: txStatus, cartId, amount, currency, orderId: existingOrderId } = txData as any;

        // 2. Handle Case 1: Payment Success (PAID/CAPTURED) -> Create Order
        if ((txStatus === 'PAID' || txStatus === 'CAPTURED') && cartId && !existingOrderId) {
            await connectToDatabase();
            
            const cart = await (Cart as any).findById(cartId);
            if (cart && cart.status === 'active') {
                const orderResult = await createOrder({
                    userId: cart.userId?.toString(),
                    items: cart.items,
                    amount: amount.value / 100,
                    currency: currency,
                    paymentMethod: txData.paymentMethodType || 'card'
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
        
        // 3. Handle Case 2: Refund
        else if (txStatus === 'REFUNDED' && existingOrderId) {
            // Logic for order refund status is already partially handled in verifyPaymentAction
            // But we can add specific logic here if we need to notify the user etc.
            console.log(`Webhook: Transaction ${id} marked as refunded.`);
        }

        // 4. Handle Case 3: Failed
        else if (txStatus === 'FAILED') {
            console.log(`Webhook: Transaction ${id} marked as failed.`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
