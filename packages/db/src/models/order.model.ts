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
            currency: { type: String, default: "USD" },
            paymentMethod: String,
        },

        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
            index: true
        },
    },
    { timestamps: true }
);

export type OrderType = InferSchemaType<typeof OrderSchema> & { _id: mongoose.Types.ObjectId };
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);