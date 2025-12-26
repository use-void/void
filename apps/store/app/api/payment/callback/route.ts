import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentAction } from '@void/payment/actions';
import { PaymentProviderId } from '@void/payment';


const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log('Payment Callback Params:', Object.fromEntries(searchParams.entries()));
  
  // Polar sends 'checkout_id', Moyasar sends 'id'
  const checkoutId = searchParams.get('checkout_id');
  const moyasarId = searchParams.get('id');
  const id = moyasarId || checkoutId;
  
  const gateway = (searchParams.get('gateway') || (checkoutId ? 'polar' : 'moyasar')) as PaymentProviderId;
  const locale = searchParams.get('locale') || 'en';
  const message = searchParams.get('message');

  let verifiedId: string | null = null;
  let verifiedResult: any = null;
  let errorMsg = message || 'Payment verification failed.';

  if (id) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const verifyResult = await verifyPaymentAction(gateway, id);

          if (verifyResult.status === 'success') {
              const { status: txStatus } = verifyResult.data;
              
              // Use unified statuses: PAID, CAPTURED, AUTHORIZED
              if (['PAID', 'CAPTURED', 'AUTHORIZED'].includes(txStatus)) {
                  verifiedId = verifyResult.data.id;
                  verifiedResult = verifyResult.data;
                  break; 
              } else if (txStatus === 'FAILED') {
                  errorMsg = verifyResult.data.failureReason || 'Payment failed.';
                  break; 
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

              if (finalCart && (finalCart.status === 'active' || finalCart.status === 'pending')) {
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
                      // Ensure we find the transaction by provider ID
                      await (db.PaymentTransaction as any).updateOne(
                          { providerTransactionId: id, provider: gateway } as any,
                          { orderId: orderResult.orderId }
                      );
                  }
              }
          }
      } catch (orderError) {
          console.error('Order creation failed after payment success:', orderError);
          // Redirect to thank-you anyway if payment is success but order logic failed (could be handled manually)
          return NextResponse.redirect(`${baseUrl}/${locale}/thank-you?id=${verifiedId}&orderError=true`);
      }

      return NextResponse.redirect(`${baseUrl}/${locale}/thank-you?id=${verifiedId}`);
  } else {
      return NextResponse.redirect(`${baseUrl}/${locale}/checkout?error=${encodeURIComponent(errorMsg)}`);
  }
}
