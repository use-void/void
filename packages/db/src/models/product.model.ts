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

        // النوع: رقمي حالياً، مادي مستقبلاً + اشتراك
        type: { type: String, enum: ["digital", "physical", "subscription"], default: "digital", required: true },

        status: { type: String, enum: ["draft", "active", "archived"], default: "draft", index: true },

        // تفاصيل المنتجات الرقمية (ملفات، روابط)
        digitalDetails: {
            fileUrl: String, 
            fileName: String,
            fileSize: String,
            isExternalLink: Boolean, 
        },

        // تفاصيل الاشتراكات
        subscriptionDetails: {
            interval: { type: String, enum: ['month', 'year', 'week', 'day'] }, // دورة الفوترة
            intervalCount: { type: Number, default: 1 }, // تكرار الدورة
            trialPeriodDays: { type: Number, default: 0 }, // فترة التجربة
        },

        // تفاصيل المنتجات المادية
        physicalDetails: {
            sku: String,
            stock: { type: Number, default: 0 },
            weight: Number,
        },

        // تكاملات (Polar, others)
        integrations: {
            polar: {
                productId: String, // ID في Polar
                priceId: String,   // ID للسعر في Polar
                url: String,       // رابط الشراء المباشر إن وجد
            }
        },

        // AI Search Vector
        searchVector: { type: [Number], index: false }, // سنقوم بإعداد الفهرس لاحقاً في Atlas
    },
    { timestamps: true }
);

export type ProductType = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };
export const Product = (mongoose.models.Product as Model<ProductType>) || 
                      mongoose.model<ProductType>("Product", ProductSchema);