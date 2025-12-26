import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentAction } from '@void/payment/actions';
import { PaymentProviderId, TransactionStatus } from '@void/payment';
import { getLocalizedValue } from '@repo/i18n';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log('Payment Callback Params:', Object.fromEntries(searchParams.entries()));
  
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
              const txStatus = verifyResult.data.status as TransactionStatus;
              
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
      try {
          const { cartId, amount, currency, metadata } = verifiedResult;
          const productId = metadata?.productId || searchParams.get('productId');
          const userId = metadata?.userId || verifiedResult.userId;

          if (cartId || productId) {
              const { createOrder } = await import("@/app/actions/checkout");
              const db = await import("@void/db");
              await db.connectToDatabase();

              let orderItems = [];
              let finalUserId = userId;
              let guestInfo = undefined;

              if (cartId) {
                  const finalCart = await (db.Cart as any).findById(cartId);
                  if (finalCart && (finalCart.status === 'active' || finalCart.status === 'pending')) {
                      orderItems = finalCart.items;
                      finalUserId = finalCart.userId?.toString() || userId;
                      
                      finalCart.status = 'converted';
                      await finalCart.save();
                  }
              } else if (productId) {
                  const product = await (db.Product as any).findById(productId);
                  if (product) {
                      const name = getLocalizedValue(product.name, locale);
                        
                      orderItems = [{
                          productId: product._id.toString(),
                          quantity: 1,
                          name: name,
                          price: product.price,
                          image: product.images?.[0]?.url || '/placeholder.png'
                      }];

                      if (!finalUserId) {
                           guestInfo = {
                               email: metadata?.customerEmail || 'guest@example.com',
                               name: metadata?.customerName || 'Guest'
                           };
                      }
                  }
              }

              if (orderItems.length > 0) {
                  const orderResult = await createOrder({
                      userId: finalUserId,
                      guestInfo,
                      items: orderItems,
                      amount: amount.value / 100, 
                      currency: currency,
                      paymentMethod: verifiedResult.paymentMethodType
                  });

                  if (orderResult.success) {
                      await (db.PaymentTransaction as any).updateOne(
                          { providerTransactionId: id, provider: gateway } as any,
                          { orderId: orderResult.orderId }
                      );
                  }
              }
          }
      } catch (orderError) {
          console.error('Order creation failed after payment success:', orderError);
          return NextResponse.redirect(`${baseUrl}/${locale}/thank-you?id=${verifiedId}&orderError=true`);
      }

      return NextResponse.redirect(`${baseUrl}/${locale}/thank-you?id=${verifiedId}`);
  } else {
      return NextResponse.redirect(`${baseUrl}/${locale}/checkout?error=${encodeURIComponent(errorMsg)}`);
  }
}
