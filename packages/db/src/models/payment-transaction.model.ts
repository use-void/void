import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PaymentTransactionSchema = new Schema(
    {
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true }, // Can be null for guest checkout
        
        provider: { 
            type: String, 
            enum: ["moyasar", "stripe", "tamara"], 
            required: true 
        },
        providerTransactionId: { type: String, unique: true, sparse: true }, // Unique ID from provider
        
        type: {
            type: String,
            enum: ["payment", "refund"],
            required: true
        },
        
        status: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded", "partially_refunded", "voided", "authorized"],
            default: "pending",
            index: true
        },
        
        amount: { type: Number, required: true }, // Integer (Smallest Unit)
        amountRefunded: { type: Number, default: 0 }, // For partial refunds
        currency: { type: String, required: true, default: "SAR" },
        
        paymentMethodType: { type: String }, // credit_card, apple_pay, etc.
        
        cardDetails: {
            brand: String,
            last4: String,
            name: String
        },
        
        idempotencyKey: { type: String, unique: true, index: true }, // To prevent double charges
        
        failureMessage: { type: String },
        
        metadata: { type: Schema.Types.Mixed } // Raw response for debugging
    },
    { timestamps: true }
);

export type PaymentTransactionType = InferSchemaType<typeof PaymentTransactionSchema> & { _id: mongoose.Types.ObjectId };
export const PaymentTransaction = mongoose.models.PaymentTransaction || mongoose.model("PaymentTransaction", PaymentTransactionSchema);
