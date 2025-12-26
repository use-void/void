'use server';

import { Order, connectToDatabase } from "@void/db";
import { randomBytes } from "crypto";

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
        paymentStatus: 'paid' // Called only after success
    });

    if (!order) {
        throw new Error("Failed to create order");
    }

    return { success: true, orderId: order._id.toString(), orderNumber: order.orderNumber };
}
