import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PaymentLogSchema = new Schema(
    {
        transactionId: { type: Schema.Types.ObjectId, ref: "PaymentTransaction", index: true },
        
        eventType: { 
            type: String, 
            enum: ["api_request", "api_response", "webhook_received", "user_action"],
            required: true 
        },
        
        provider: { type: String }, // moyasar
        
        url: { type: String }, // Endpoint URL
        method: { type: String }, // GET, POST
        
        payload: { type: Schema.Types.Mixed }, // Request body
        response: { type: Schema.Types.Mixed }, // Response body
        
        statusCode: { type: Number },
        
        ipAddress: { type: String },
        
    },
    { timestamps: true }
);

export type PaymentLogType = InferSchemaType<typeof PaymentLogSchema> & { _id: mongoose.Types.ObjectId };
export const PaymentLog = mongoose.models.PaymentLog || mongoose.model("PaymentLog", PaymentLogSchema);
