import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
    {
        // --- Better Auth Core Fields ---
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, default: false },
        image: { type: String },
        phone: { type: String }, // Admin/User Phone
        role: { type: String, default: "customer" }, 
        banned: { type: Boolean, default: false },

        // --- Custom Extensions (Store Specific) ---
        customerProfile: {
            phone: String,
            addresses: [
                {
                    label: String, // e.g. "Home"
                    country: String,
                    city: String,
                    line1: String,
                    postalCode: String,
                    isDefault: { type: Boolean, default: false },
                },
            ],
            preferences: {
                currency: String,
                language: String,
            },
            walletBalance: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

// تصدير النوع
export type UserType = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

// الحل هنا: إجبار TypeScript على معرفة أن هذا هو موديل من نوع UserType
export const User = (mongoose.models.User as Model<UserType>) || mongoose.model<UserType>("User", UserSchema);