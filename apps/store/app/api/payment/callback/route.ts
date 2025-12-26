import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentAction } from '@void/payment/actions';


const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log('Payment Callback Params:', Object.fromEntries(searchParams.entries()));
  
  const status = searchParams.get('status');
  // Polar sends 'checkout_id', Moyasar sends 'id'
  const checkoutId = searchParams.get('checkout_id');
  const id = searchParams.get('id') || checkoutId;
  const message = searchParams.get('message');
  const locale = searchParams.get('locale') || 'en';
  const gateway = searchParams.get('gateway') || (checkoutId ? 'polar' : 'moyasar'); // Auto-detect or use explicit

  let verifiedId: string | null = null;
  let verifiedResult: any = null;
  let errorMsg = message || 'Payment verification failed.';

  if (id) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          // Use the dynamic gateway, defaulting to Moyasar if unknown
          const providerName: any = gateway === 'polar' ? 'polar' : 'moyasar';
          const verifyResult = await verifyPaymentAction(providerName, id);

          if (verifyResult.status === 'success') {
              const { status: txStatus } = verifyResult.data;
              
              // Map Polar statuses generally map to 'paid'/'authorized'. 
              // Moyasar uses 'paid'.
              if (['paid', 'captured', 'authorized', 'succeeded', 'confirmed'].includes(txStatus?.toLowerCase())) {
                 verifiedId = verifyResult.data.id;
                 verifiedResult = verifyResult.data;
                 break; // Success!
              } else if (txStatus?.toLowerCase() === 'failed') {
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
              
              // We likely have an _id for cart, ensure correct lookup
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
