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
           transactionRecord = await (PaymentTransaction as any).create({
               orderId: options.metadata?.orderId,
               cartId: options.metadata?.cartId,
               userId: options.metadata?.userId || options.metadata?.sessionId, // Supporting optional userId
               provider: providerName,
               type: 'payment',
               status: 'pending',
               amount: options.amount,
               currency: options.currency,
               idempotencyKey: idempotencyKey,
               tokenId: options.metadata?.tokenId,
               isRecurring: options.metadata?.isRecurring || false,
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
  transactionId: string
): Promise<PaymentResult> {
  await connectToDatabase();
  const config = { secretKey: process.env.MOYASAR_SECRET_KEY };
  
  try {
    const provider = PaymentFactory.getProvider(providerName as any, config);
    
    // 1. Fetch latest status from Provider
    const result = await provider.verify(transactionId);
    
    // 2. Update DB if successful
    if (result.status === 'success') {
        const txData = result.data;
        const { 
          status: txStatus, 
          metadata, 
          failureReason, 
          reference, 
          cardDetails, 
          responseCode, 
          gatewayId, 
          terminalId, 
          tokenId,
          paymentMethodType,
          cartId: rootCartId,
          orderId: rootOrderId
        } = txData as any;
        
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
            orderPaymentStatus = dbStatus === 'voided' ? 'voided' : (dbStatus === 'refunded' ? 'refunded' : 'failed');
        }

        // Find transaction by Provider ID
        const dbTx = await (PaymentTransaction as any).findOne({ providerTransactionId: transactionId });
        
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
            if (tokenId) dbTx.tokenId = tokenId;
            if (paymentMethodType) dbTx.paymentMethodType = paymentMethodType;
        
            if (dbStatus === 'failed' || failureReason) {
                dbTx.failureMessage = failureReason; // Legacy field support
                dbTx.failureReason = failureReason;
            }

            await dbTx.save();
            
            // Update Order Status if cart was already linked to an order
            if (dbTx.orderId) {
                await (Order as any).updateOne(
                    { _id: dbTx.orderId } as any,
                    { paymentStatus: orderPaymentStatus }
                );
            }

            // Log Verification
            await (PaymentLog as any).create({
                transactionId: dbTx._id,
                eventType: 'api_response',
                provider: providerName,
                response: result.data,
                statusCode: 200
            });

            // Return cartId and orderId in the result data for the caller to handle logic
            (result.data as any).cartId = dbTx.cartId?.toString() || rootCartId;
            (result.data as any).orderId = dbTx.orderId?.toString() || rootOrderId;
        } else {
            // Fallback for missing DB record (metadata mapping)
            (result.data as any).cartId = (result.data as any).cartId || rootCartId || (metadata as any)?.cartId;
            (result.data as any).orderId = (result.data as any).orderId || rootOrderId || (metadata as any)?.orderId;
        }
    }

    return result;
  } catch (error: any) {
    console.error('Verify Payment Action Error:', error);
    return {
      status: 'error',
      code: 'VERIFICATION_FAILED',
      message: error.message || 'Verification failed',
    };
  }
}

export async function refundPaymentAction(
  providerName: 'moyasar' | 'stripe',
  transactionId: string,
  amount?: number, // in major unit (e.g. 50.00 SAR), optional for full refund
  reason?: string
): Promise<PaymentResult> {
    await connectToDatabase();
    const config = { secretKey: process.env.MOYASAR_SECRET_KEY };
    
    try {
        const provider = PaymentFactory.getProvider(providerName as any, config);
        
        // Find existing transaction to get small units and order links
        const dbTx = await PaymentTransaction.findOne({ providerTransactionId: transactionId } as any);
        if (!dbTx) return { status: 'error', code: 'NOT_FOUND', message: 'Transaction not found' };

        // Convert amount to smallest unit if provided, otherwise null for full refund
        const amountSmallestUnit = amount ? Math.round(amount * 100) : undefined;
        
        const result = await provider.refund(transactionId, amountSmallestUnit, reason);
        
        if (result.status === 'success') {
            const refundData = result.data;
            
            // Update DB Transaction
            dbTx.status = refundData.status.toLowerCase();
            dbTx.amountRefunded = (dbTx.amountRefunded || 0) + (amountSmallestUnit || dbTx.amount);
            dbTx.timeline.push({
                status: 'refunded',
                date: new Date(),
                message: `Refund of ${amount || (dbTx.amount/100)} processed. Reason: ${reason || 'N/A'}`
            });
            await dbTx.save();
            
            // Update Order
            if (dbTx.orderId) {
                const order = await (Order as any).findById(dbTx.orderId);
                if (order) {
                    order.financials.totalRefunded = (order.financials.totalRefunded || 0) + (amount || (dbTx.amount/100));
                    order.paymentStatus = order.financials.totalRefunded >= order.financials.total ? 'refunded' : 'partially_refunded';
                    if (order.paymentStatus === 'refunded') order.status = 'refunded';
                    await order.save();
                }
            }
        }
        return result;
    } catch (error: any) {
        console.error('Refund Action Error:', error);
        return { status: 'error', code: 'REFUND_FAILED', message: error.message };
    }
}

export async function capturePaymentAction(
  providerName: 'moyasar' | 'stripe',
  transactionId: string,
  amount?: number
): Promise<PaymentResult> {
    await connectToDatabase();
    const config = { secretKey: process.env.MOYASAR_SECRET_KEY };
    
    try {
        const provider = PaymentFactory.getProvider(providerName as any, config);
        const amountSmallestUnit = amount ? Math.round(amount * 100) : undefined;
        
        const result = await provider.capture(transactionId, amountSmallestUnit);
        
        if (result.status === 'success') {
            const captureData = result.data;
            const dbTx = await PaymentTransaction.findOne({ providerTransactionId: transactionId } as any);
            
            if (dbTx) {
                dbTx.status = 'paid';
                dbTx.timeline.push({
                    status: 'paid',
                    date: new Date(),
                    message: `Authorized payment captured. Amount: ${amount || (dbTx.amount/100)}`
                });
                await dbTx.save();
                
                if (dbTx.orderId) {
                    await (Order as any).updateOne({ _id: dbTx.orderId } as any, { paymentStatus: 'paid' });
                }
            }
        }
        return result;
    } catch (error: any) {
        console.error('Capture Action Error:', error);
        return { status: 'error', code: 'CAPTURE_FAILED', message: error.message };
    }
}

