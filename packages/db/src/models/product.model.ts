import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const LocalizedString = {
    type: Map,
    of: String,
    required: true
};

const ProductSchema = new Schema(
    {
        name: LocalizedString,
        slug: { type: String, required: true, unique: true, index: true },
        description: { type: Map, of: String },

        category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },

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

export type ProductType = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };
export const Product = (mongoose.models.Product as Model<ProductType>) || 
                      mongoose.model<ProductType>("Product", ProductSchema);