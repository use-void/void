import mongoose, { Schema, type InferSchemaType } from "mongoose";

const OrderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    // Snapshot: نحفظ البيانات كما كانت وقت الشراء
    snapshot: {
        name: String,
        price: Number,
        image: String,
        digitalFileUrl: String, // الرابط الذي حصل عليه العميل
    }
});

const OrderSchema = new Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        user: { type: Schema.Types.ObjectId, ref: "User", index: true }, // قد يكون null للزوار

        // معلومات الزائر إذا لم يكن مسجلاً
        guestInfo: { email: String, name: String },

        items: [OrderItemSchema],

        financials: {
            total: { type: Number, required: true },
            totalRefunded: { type: Number, default: 0 },
            currency: { type: String, default: "SAR" },
            paymentMethod: String,
        },

        status: {
            type: String,
            enum: ["pending", "processing", "completed", "cancelled", "refunded"],
            default: "pending",
            index: true
        },
        
        paymentStatus: {
            type: String,
            enum: ["unpaid", "authorized", "paid", "partially_refunded", "refunded", "voided", "failed"],
            default: "unpaid",
            index: true
        },
        
        totalDue: { type: Number, default: 0 } // Amount remaining to be paid
    },
    { timestamps: true }
);

export type OrderType = InferSchemaType<typeof OrderSchema> & { _id: mongoose.Types.ObjectId };
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);