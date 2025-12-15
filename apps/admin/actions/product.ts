'use server';

import { Product, connectDB } from "@void/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export async function getProducts() {
    await connectDB();
    try {
        const products = await (Product as any).find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(products));
    } catch (e) {
        console.error("Failed to fetch products:", e);
        return [];
    }
}

export async function getProduct(id: string) {
    await connectDB();
    try {
        const product = await (Product as any).findById(id).lean();
        if (!product) return null;
        return JSON.parse(JSON.stringify(product));
    } catch (e) {
        return null;
    }
}

export async function createProduct(formData: FormData) {
    await connectDB();
    const rawData = Object.fromEntries(formData.entries());

    // Simple validation & transformation
    const productData = {
        name: rawData.name,
        slug: (rawData.name as string).toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: rawData.description,
        price: Number(rawData.price),
        status: rawData.status || 'draft',
        type: rawData.type || 'digital',
        images: rawData.imageUrl ? [{ url: rawData.imageUrl, isThumbnail: true }] : []
    };

    try {
        await (Product as any).create(productData);
    } catch (e) {
        return { error: "Failed to create product" };
    }

    const locale = await getLocale();
    revalidatePath(`/${locale}/products`);
    redirect(`/${locale}/products`);
}

export async function updateProduct(id: string, formData: FormData) {
    await connectDB();
    const rawData = Object.fromEntries(formData.entries());

    const productData = {
        name: rawData.name,
        description: rawData.description,
        price: Number(rawData.price),
        status: rawData.status,
        type: rawData.type,
        // Basic image handling for demo - in real app would use proper array management
        ...(rawData.imageUrl ? { images: [{ url: rawData.imageUrl, isThumbnail: true }] } : {})
    };

    try {
        await (Product as any).findByIdAndUpdate(id, productData);
    } catch (e) {
        return { error: "Failed to update product" };
    }

    const locale = await getLocale();
    revalidatePath(`/${locale}/products`);
    redirect(`/${locale}/products`);
}

export async function deleteProduct(id: string) {
    await connectDB();
    try {
        await (Product as any).findByIdAndDelete(id);
        const locale = await getLocale();
        revalidatePath(`/${locale}/products`);
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete product" };
    }
}
