import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PaymentMethodSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        
        provider: { type: String, required: true }, // moyasar, stripe
        providerToken: { type: String, required: true }, // The source token
        
        fingerprint: { type: String }, // To detect duplicate cards
        
        last4: { type: String },
        brand: { type: String },
        
        expiryMonth: { type: Number },
        expiryYear: { type: Number },
        
        isDefault: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// Compound index to quickly find user's default card
PaymentMethodSchema.index({ userId: 1, isDefault: -1 });

export type PaymentMethodType = InferSchemaType<typeof PaymentMethodSchema> & { _id: mongoose.Types.ObjectId };
export const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model("PaymentMethod", PaymentMethodSchema);
