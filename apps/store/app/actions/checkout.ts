'use server';

import { Order, connectToDatabase } from "@void/db";
import { randomBytes } from "crypto";

export async function createOrder(data: {
    userId?: string;
    items: any[];
    amount: number;
    currency: string;
}) {
    await connectToDatabase();

    const orderNumber = `ORD-${randomBytes(4).toString('hex').toUpperCase()}`;

    const order = await Order.create({
        orderNumber,
        user: data.userId || null, 
        items: data.items.map(item => ({
            product: item.id, // Assuming item.id is the Product ID
            quantity: item.quantity,
            price: item.price
        })),
        financials: {
            total: data.amount,
            currency: data.currency,
            paymentMethod: 'card' // Default or passed
        },
        status: 'pending',
        paymentStatus: 'unpaid'
    });

    if (!order) {
        throw new Error("Failed to create order");
    }

    return { success: true, orderId: order._id.toString() };
}
