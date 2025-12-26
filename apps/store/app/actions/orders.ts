'use server';

import { Order, connectToDatabase } from "@void/db";
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserOrders(userId: string) {
    noStore();
    try {
        await connectToDatabase();
        // Fetch orders for the user, sorted by date
        const orders = await Order.find({ user: userId } as any).sort({ createdAt: -1 }).lean();
        
        // Fetch transactions for these orders
        const orderIds = orders.map(o => o._id);
        const transactions = await import("@void/db").then(m => 
            m.PaymentTransaction.find({ orderId: { $in: orderIds } } as any).lean()
        );

        return orders.map(order => {
            const orderTransactions = transactions
                .filter(t => t.orderId.toString() === order._id.toString())
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first

            return {
                id: order._id.toString(),
                orderNumber: order.orderNumber,
                createdAt: order.createdAt,
                total: order.financials.total,
                status: order.status,
                paymentStatus: (order as any).paymentStatus,
                transactions: orderTransactions.map(t => ({
                    ...t,
                    _id: t._id.toString(),
                    orderId: t.orderId.toString(),
                    userId: t.userId?.toString(),
                    createdAt: t.createdAt.toISOString()
                })),
                items: order.items 
            };
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
}
