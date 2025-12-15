import mongoose, { Schema, type InferSchemaType } from "mongoose";

const IntegrationSchema = new Schema(
    {
        providerId: { type: String, required: true }, // e.g., 'stripe', 'sendgrid'
        type: { type: String, enum: ["payment", "email", "analytics"], required: true },
        isEnabled: { type: Boolean, default: false },

        // Credentials تخزن كـ Object مرن لأن كل خدمة تختلف عن الأخرى
        // في بيئة الإنتاج يفضل تشفير هذه الحقول قبل الحفظ
        credentials: { type: Schema.Types.Mixed },

        config: { type: Schema.Types.Mixed }, // إعدادات عامة غير سرية
    },
    { timestamps: true }
);

// مركب لضمان عدم تكرار نفس الخدمة لنفس النوع
IntegrationSchema.index({ providerId: 1, type: 1 }, { unique: true });

export type IntegrationType = InferSchemaType<typeof IntegrationSchema> & { _id: mongoose.Types.ObjectId };
export const Integration = mongoose.models.Integration || mongoose.model("Integration", IntegrationSchema);