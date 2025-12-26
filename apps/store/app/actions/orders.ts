'use server';

import { Order, connectToDatabase } from "@void/db";
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserOrders(userId: string) {
    noStore();
    try {
        await connectToDatabase();
        // Fetch orders for the user, sorted by date
        const orders = await Order.find({ user: userId } as any).sort({ createdAt: -1 }).lean();
        
        return orders.map(order => ({
            id: order._id.toString(),
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            total: order.financials.total,
            status: order.status,
            paymentStatus: (order as any).paymentStatus,
            items: order.items // we might need to populate products later
        }));
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
}
