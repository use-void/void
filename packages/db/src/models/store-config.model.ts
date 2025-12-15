import mongoose, { Schema, type InferSchemaType } from "mongoose";

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
export const StoreConfig = mongoose.models.StoreConfig || mongoose.model("StoreConfig", StoreConfigSchema);