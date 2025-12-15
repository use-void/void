import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
    {
        name: { type: String, required: true, index: "text" },
        slug: { type: String, required: true, unique: true, index: true },
        description: String,

        price: { type: Number, required: true, index: true },
        compareAtPrice: Number, // سعر قبل الخصم

        images: [{ url: String, alt: String, isThumbnail: Boolean }],

        // النوع: رقمي حالياً، مادي مستقبلاً
        type: { type: String, enum: ["digital", "physical"], default: "digital", required: true },

        status: { type: String, enum: ["draft", "active", "archived"], default: "draft", index: true },

        // تفاصيل المنتجات الرقمية (ملفات، روابط)
        digitalDetails: {
            fileUrl: String, // رابط الملف الآمن
            fileName: String,
            fileSize: String,
            isExternalLink: Boolean, // هل هو رابط خارجي؟
        },

        // تفاصيل المنتجات المادية (مستقبلاً)
        physicalDetails: {
            sku: String,
            stock: { type: Number, default: 0 },
            weight: Number,
        },

        // AI Search Vector
        searchVector: { type: [Number], index: false }, // سنقوم بإعداد الفهرس لاحقاً في Atlas
    },
    { timestamps: true }
);

export type ProductType = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };
export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);