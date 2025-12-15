import mongoose, { Schema, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
    {
        // --- Better Auth Core Fields (Do Not Touch Logic) ---
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, default: false },
        image: { type: String },
        phone: { type: String }, // Admin/User Phone
        role: { type: String, default: "customer" }, // better-auth-role plugin usually handles this
        banned: { type: Boolean, default: false },

        // --- Custom Extensions (Store Specific) ---
        // ملف العميل المنفصل لتجنب التداخل مع بيانات المصادقة الأساسية
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
        timestamps: true, // Auto manage createdAt, updatedAt
    }
);

// تصدير النوع ليستخدم في الفرونت إند
export type UserType = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

// التأكد من عدم إعادة تعريف الموديل في Next.js Hot Reload
export const User = mongoose.models.User || mongoose.model("User", UserSchema);