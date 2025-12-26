'use server';

import { Order, connectToDatabase, Product } from "@void/db";
import { randomBytes } from "crypto";
import { createPaymentIntentAction } from "@void/payment/actions";
import { getSession } from "@void/auth";
import { getLocalizedValue } from "@repo/i18n";
import { getPaymentConfig } from "./config";
import type { Currency } from "@void/payment";

export async function createOrder(data: {
    userId?: string;
    guestInfo?: { email: string; name: string };
    items: any[];
    amount: number;
    currency: string;
    paymentMethod?: string;
}) {
    await connectToDatabase();

    const orderNumber = `ORD-${randomBytes(4).toString('hex').toUpperCase()}`;

    const order = await Order.create({
        orderNumber,
        user: data.userId || null, 
        guestInfo: data.guestInfo,
        items: data.items.map(item => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
            snapshot: {
                name: item.name,
                price: item.price,
                image: item.image
            }
        })),
        financials: {
            total: data.amount,
            currency: data.currency,
            paymentMethod: data.paymentMethod || 'card'
        },
        status: 'pending',
        paymentStatus: 'paid' 
    });

    if (!order) {
        throw new Error("Failed to create order");
    }

    return { success: true, orderId: order._id.toString(), orderNumber: order.orderNumber };
}

export async function initiatePolarCheckout(productId: string, locale: string = 'en') {
    await connectToDatabase();
    
    // 1. Get Product info
    const product = await (Product as any).findById(productId);
    if (!product) throw new Error("Product not found");

    const session = await getSession();
    const config = await getPaymentConfig();

    // 2. Call Payment Intent Action for Polar
    const result = await createPaymentIntentAction('polar', {
        amount: product.price,
        currency: (config.defaultCurrency || 'USD') as Currency,
        description: `Subscription: ${getLocalizedValue(product.name, locale)}`,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?gateway=polar&locale=${locale}&checkout_id={CHECKOUT_ID}`,
        metadata: {
            productId: product._id.toString(),
            userId: session?.user?.id,
            type: 'subscription',
            polarProductIds: [product.integrations?.polar?.productId].filter(Boolean)
        }
    });

    if (result.status === 'success') {
        const data = result.data as any;
        const checkoutUrl = data.checkoutUrl || data.metadata?.checkoutUrl || data.url;
        
        if (!checkoutUrl) {
             console.error("❌ Polar Checkout Error: No URL found in result", result);
             throw new Error("Polar checkout URL missing in response");
        }
        
        return { success: true, checkoutUrl };
    }

    return { success: false, message: result.message };
}
