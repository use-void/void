import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
    {
        // Better Auth يستخدم String للـ ID عادةً، لذا نحتاج لتعريف ذلك لضمان التوافق
        // إذا كان Better Auth يستخدم ObjectId، يمكنك إزالة هذا السطر، لكن الأغلب هو String
        _id: { type: String }, 
        
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, default: false },
        image: { type: String },
        role: { type: String, default: "customer" }, 
        banned: { type: Boolean, default: false },
        
        // الحقول الإضافية
        phone: { type: String },
        customerProfile: {
            phone: String,
            addresses: [
                {
                    label: String,
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
        _id: false, // نمنع Mongoose من إنشاء ObjectId تلقائي لأن Better Auth يدير الـ ID
        collection: "user" // ✅ إجبار Mongoose على الكتابة في نفس مكان Better Auth
    }
);

export type UserType = InferSchemaType<typeof UserSchema>; // & { _id: string }

// التحقق من وجود الموديل لمنع إعادة التجميع
export const User = (mongoose.models.User as Model<UserType>) || mongoose.model<UserType>("User", UserSchema);