// apps/admin/lib/data/products.ts
import 'server-only';
import { connectDB, Product, type ProductType } from "@void/db";
import { cache } from "react";
import { verifySession } from "@/lib/data/dal"; // سننشئ هذا الملف لاحقاً للتحقق الموحد

// نستخدم cache من React لضمان عدم تكرار الطلب في نفس الـ Request
// لا نستخدم unstable_cache هنا لأننا نريد بيانات حية (Fresh) للوحة التحكم
export const getProductDTO = cache(async (id: string) => {
    // 1. التحقق من الصلاحيات أولاً
    await verifySession("products", "read");

    // 2. الاتصال بالقاعدة
    await connectDB();

    // 3. جلب البيانات
    const product = await Product.findById(id).lean<ProductType>();

    if (!product) return null;

    // 4. تحويل البيانات (Serialization)
    // تحويل _id إلى string لكي يفهمها React Server Component
    return {
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
    };
});