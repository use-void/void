import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentAction } from '@void/payment/actions';


const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const id = searchParams.get('id');
  const message = searchParams.get('message');
  const locale = searchParams.get('locale') || 'en'; // Fallback locale

  let verifiedId: string | null = null;
  let verifiedResult: any = null;
  let errorMsg = message || 'Payment verification failed.';

  if (id) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const verifyResult = await verifyPaymentAction('moyasar', id);

          if (verifyResult.status === 'success') {
              const { status: txStatus } = verifyResult.data;
              
              if (txStatus === 'PAID' || txStatus === 'CAPTURED' || txStatus === 'AUTHORIZED') {
                 verifiedId = verifyResult.data.id;
                 verifiedResult = verifyResult.data;
                 break; // Success!
              } else if (txStatus === 'FAILED') {
                 errorMsg = verifyResult.data.metadata?.source?.message || 'Payment failed.';
                 break; // Stop retrying
              }
          } else {
              errorMsg = verifyResult.message;
          }
          
          if (i < MAX_RETRIES - 1) await sleep(RETRY_DELAY_MS);
          
        } catch (error) {
          console.error('Payment callback verification attempt failed', error);
          if (i === MAX_RETRIES - 1) errorMsg = 'Verification exception occurred';
        }
    }
  } else {
     errorMsg = 'Invalid callback: Missing Transaction ID';
  }

  const baseUrl = request.nextUrl.origin;

  if (verifiedId && verifiedResult) {
      // 1. Order Creation Logic
      try {
          const { cartId, amount, currency } = verifiedResult;

          if (cartId) {
              // 2. Create Order from Cart
              const { createOrder } = await import("@/app/actions/checkout");
              const db = await import("@void/db");
              
              await db.connectToDatabase();
              const finalCart = await (db.Cart as any).findById(cartId);

              if (finalCart && finalCart.status === 'active') {
                  const orderResult = await createOrder({
                      userId: finalCart.userId?.toString(),
                      items: finalCart.items,
                      amount: amount.value / 100, // Smallest unit to main unit
                      currency: currency,
                      paymentMethod: verifiedResult.paymentMethodType || 'card'
                  });

                  if (orderResult.success) {
                      // 3. Mark Cart as converted
                      finalCart.status = 'converted';
                      await finalCart.save();

                      // 4. Link Order to Transaction
                      await (db.PaymentTransaction as any).updateOne(
                          { providerTransactionId: id } as any,
                          { orderId: orderResult.orderId }
                      );
                  }
              }
          }
      } catch (orderError) {
          console.error('Order creation failed after payment success:', orderError);
          // Redirect to thank-you anyway if payment is success
          return NextResponse.redirect(`${baseUrl}/${locale}/thank-you?id=${verifiedId}&orderError=true`);
      }

      return NextResponse.redirect(`${baseUrl}/${locale}/thank-you?id=${verifiedId}`);
  } else {
      return NextResponse.redirect(`${baseUrl}/${locale}/checkout?error=${encodeURIComponent(errorMsg)}`);
  }
}
