'use server';

import { PaymentFactory } from './factory';
import { CreatePaymentOptions, PaymentResult } from '../core/types';
import { connectToDatabase, PaymentTransaction, PaymentLog, Order } from '@void/db';
import { randomUUID } from 'crypto';

// This action should be called by the frontend
export async function createPaymentIntentAction(
  providerName: 'moyasar' | 'stripe',
  options: CreatePaymentOptions
): Promise<PaymentResult> {
  await connectToDatabase();

  const config = {
    secretKey: process.env.MOYASAR_SECRET_KEY,
    publishableKey: process.env.MOYASAR_PUBLISHABLE_KEY,
  };
  
  // Idempotency Key Generation if not provided? Assuming options might have metadata orderId
  const idempotencyKey = randomUUID(); 
  
  // 1. Create Pending Transaction Record
  let transactionRecord;
  try {
      if (options.metadata?.orderId || options.metadata?.cartId) {
           transactionRecord = await PaymentTransaction.create({
               orderId: options.metadata?.orderId,
               cartId: options.metadata?.cartId,
               provider: providerName,
               type: 'payment',
               status: 'pending',
               amount: options.amount,
               currency: options.currency,
               idempotencyKey: idempotencyKey,
               createdAt: new Date(),
               timeline: [{
                   status: 'pending',
                   date: new Date(),
                   message: 'Payment Initiated'
               }]
           });
           
           // Log initiation
           await PaymentLog.create({
               transactionId: transactionRecord._id,
               eventType: 'api_request',
               provider: providerName,
               url: '/payments', // conceptual endpoint
               method: 'POST',
               payload: { ...options, source: '***' }, 
               ipAddress: 'server-action',
           });
      }
  } catch (dbError) {
      console.error('DB Error creating pending transaction:', dbError);
      // We continue, but this is critical logging failure
  }

  try {
    const provider = PaymentFactory.getProvider(providerName as any, config);
    const result = await provider.authorize(options);
    
    // 2. Update Transaction with Provider ID
    if (transactionRecord && result.status === 'success') {
        const { id, rawResponse, reference, gatewayId } = result.data;
        await PaymentTransaction.updateOne(
            { _id: transactionRecord._id } as any, 
            { 
                providerTransactionId: id,
                reference: reference,
                gatewayId: gatewayId,
                metadata: rawResponse
            }
        );
        
        await PaymentLog.create({
            transactionId: transactionRecord._id,
            eventType: 'api_response',
            provider: providerName,
            response: result.data,
            statusCode: 200
        });
    }

    return result;
  } catch (error: any) {
    console.error('Payment Action Error:', error);
    
    // Log Failure
    if (transactionRecord) {
         await PaymentLog.create({
            transactionId: transactionRecord._id,
            eventType: 'api_response',
            provider: providerName,
            response: { error: error.message },
            statusCode: 500
        });
        
        await PaymentTransaction.updateOne(
            { _id: transactionRecord._id } as any, 
            { 
                status: 'failed',
                failureMessage: error.message,
                $push: {
                    timeline: {
                        status: 'failed',
                        date: new Date(),
                        message: error.message
                    }
                }
            }
        );
    }

    return {
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: error.message || 'An internal error occurred',
    };
  }
}

export async function verifyPaymentAction(
  providerName: 'moyasar' | 'stripe',
  transactionId: string // This is the PROVIDER transaction ID
): Promise<PaymentResult> {
   await connectToDatabase();

   const config = {
    secretKey: process.env.MOYASAR_SECRET_KEY,
    publishableKey: process.env.MOYASAR_PUBLISHABLE_KEY,
  };

  try {
    const provider = PaymentFactory.getProvider(providerName as any, config);
    
    // 1. Fetch latest status from Provider
    const result = await provider.verify(transactionId);
    
    // 2. Update DB if successful
    if (result.status === 'success') {
        const txData = result.data;
        const { status: txStatus, metadata, failureReason, reference, cardDetails, responseCode, gatewayId, terminalId } = txData;
        
        // Map Unified Status to DB Status
        let dbStatus = 'pending';
        let orderPaymentStatus = 'unpaid';

        if (txStatus === 'PAID' || txStatus === 'CAPTURED') {
            dbStatus = 'paid';
            orderPaymentStatus = 'paid';
        } else if (txStatus === 'AUTHORIZED') {
            dbStatus = 'authorized';
            orderPaymentStatus = 'authorized';
        } else if (txStatus === 'FAILED' || txStatus === 'VOIDED' || txStatus === 'REFUNDED') {
            dbStatus = txStatus.toLowerCase();
            orderPaymentStatus = dbStatus === 'voided' ? 'failed' : dbStatus;
        }

        // Find transaction by Provider ID
        const dbTx = await PaymentTransaction.findOne({ providerTransactionId: transactionId } as any);
        
        if (dbTx) {
            // Check if status changed to push to timeline
            if (dbTx.status !== dbStatus) {
                dbTx.timeline.push({
                    status: dbStatus,
                    date: new Date(),
                    message: failureReason || `Transaction is ${dbStatus}`
                });
            }

            dbTx.status = dbStatus;
            dbTx.metadata = metadata;
            
            // Save detailed info
            if (reference) dbTx.reference = reference;
            if (responseCode) dbTx.responseCode = responseCode;
            if (gatewayId) dbTx.gatewayId = gatewayId;
            if (terminalId) dbTx.terminalId = terminalId;
            if (cardDetails) dbTx.cardDetails = cardDetails;
            
            if (dbStatus === 'failed' || failureReason) {
                dbTx.failureMessage = failureReason; // Legacy field support
                dbTx.failureReason = failureReason;
            }

            await dbTx.save();
            
            // Update Order Status
            if (dbTx.orderId) {
                await Order.updateOne(
                    { _id: dbTx.orderId } as any,
                    { paymentStatus: orderPaymentStatus }
                );
            }

            // Log Verification
            await PaymentLog.create({
                transactionId: dbTx._id,
                eventType: 'api_response',
                provider: providerName,
                response: result.data,
                statusCode: 200
            });

            // Return cartId and orderId in the result data for the caller to handle logic
            (result.data as any).cartId = dbTx.cartId;
            (result.data as any).orderId = dbTx.orderId;
        }
    }

    return result;
  } catch (error: any) {
    return {
      status: 'error',
      code: 'VERIFICATION_FAILED',
      message: error.message || 'Verification failed',
    };
  }
}
