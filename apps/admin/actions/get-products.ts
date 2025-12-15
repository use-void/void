"use cache";

import { connectDB, Product } from "@void/db"; // 👈 استدعِ connectDB بدلاً من getDbSync
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

interface GetProductsParams {
    page?: number;
    limit?: number;
    query?: string;
}

export async function getProducts({ page = 1, limit = 10, query = "" }: GetProductsParams) {
    // 1. ✅✅ خطوة حاسمة: انتظار الاتصال الفعلي بقاعدة البيانات
    await connectDB();

    cacheTag("products-list");

    // حساب الترحيل
    const skip = (page - 1) * limit;

    // بناء فلتر البحث
    const filter: any = { status: { $ne: "archived" } };
    if (query) {
        filter.$text = { $search: query };
    }

    // 2. جلب البيانات
    const products = await Product.find(filter)
        .select("name price status stock type image updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Product.countDocuments(filter);

    // 3. تحويل البيانات
    const formattedProducts = products.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        status: p.status,
        stock: p.physicalDetails?.stock || 0,
        type: p.type,
        image: p.images?.[0]?.url || null,
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
    }));

    return {
        data: formattedProducts,
        metadata: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + products.length < total
        }
    };
}