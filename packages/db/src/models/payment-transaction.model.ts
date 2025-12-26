import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PaymentTransactionSchema = new Schema(
    {
        orderId: { type: Schema.Types.ObjectId, ref: "Order", index: true }, // Optional until payment success
        cartId: { type: Schema.Types.ObjectId, ref: "Cart", index: true }, // To link to cart during pending phase
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true }, // Can be null for guest checkout
        
        provider: { 
            type: String, 
            enum: ["moyasar", "stripe", "tamara", "polar"], 
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
            scheme: String,
            last4: String,
            name: String
        },
        
        idempotencyKey: { type: String, unique: true, index: true }, // To prevent double charges
        
        // Detailed Payment Info
        reference: String, // Moyasar Reference
        responseCode: String,
        gatewayId: String,
        terminalId: String,
        
        failureReason: { type: String },
        
        // For Saved Cards / Recurring
        tokenId: { type: String, index: true },
        isRecurring: { type: Boolean, default: false },
        
        metadata: { type: Schema.Types.Mixed }, // Structured metadata
        
        timeline: [{
            status: String,
            date: { type: Date, default: Date.now },
            message: String
        }],
        
        rawResponse: { type: Schema.Types.Mixed } // Raw response for debugging
    },
    { 
        timestamps: true,
        collection: "transactions"
    }
);

export type PaymentTransactionType = InferSchemaType<typeof PaymentTransactionSchema> & { _id: mongoose.Types.ObjectId };
export const PaymentTransaction = mongoose.models.PaymentTransaction || mongoose.model("PaymentTransaction", PaymentTransactionSchema);
