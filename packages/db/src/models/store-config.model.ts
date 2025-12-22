import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const StoreConfigSchema = new Schema(
    {
        isSetupCompleted: { type: Boolean, default: false },
        storeName: { type: String, default: "My Store" },
        supportEmail: String,

        currency: { type: String, default: "USD" },
        language: { type: String, default: "en" },

        maintenanceMode: { type: Boolean, default: false },

        logo: String,
        description: { type: String, required: true },

        location: {
            country: { type: String, required: true },
            city: { type: String, required: true },
            address: { type: String, required: true },
        },
        phone: String,
        timezone: { type: String, default: "UTC" },

        seo: {
            titleTemplate: { type: String, default: "%s | My Store" },
            description: String,
            ogImage: String,
        },
    },
    { timestamps: true }
);

export type StoreConfigType = InferSchemaType<typeof StoreConfigSchema>;

// الحل هنا: إجبار TypeScript على معرفة أن هذا هو موديل من نوع StoreConfigType
export const StoreConfig = (mongoose.models.StoreConfig as Model<StoreConfigType>) || mongoose.model<StoreConfigType>("StoreConfig", StoreConfigSchema);