'use server';

import { Cart, connectToDatabase } from "@void/db";
import { revalidatePath } from "next/cache";

export async function syncCartWithDB(userId: string | undefined, sessionId: string | undefined, items: any[]) {
    await connectToDatabase();

    if (!userId && !sessionId) {
        return { success: false, message: "No identifying session or user" };
    }

    const query = userId ? { userId } : { sessionId };
    
    const cart = await (Cart as any).findOneAndUpdate(
        query,
        {
            items: items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                image: item.image
            })),
            status: 'active'
        },
        { upsert: true, new: true }
    );

    if (!cart) {
        return { success: false, message: "Failed to sync cart" };
    }

    return { success: true, cartId: cart._id.toString() };
}

export async function getCart(userId: string | undefined, sessionId: string | undefined) {
    await connectToDatabase();
    
    const query = userId ? { userId } : { sessionId };
    const cart = await (Cart as any).findOne({ ...query, status: 'active' });
    
    return cart;
}
