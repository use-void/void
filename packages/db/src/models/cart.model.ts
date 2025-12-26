import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Snapshot of price at time of adding to cart
    name: { type: String, required: true },
    image: { type: String },
});

const CartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true, unique: true, sparse: true },
        // For guest carts, we can use a session ID or just link it to the payment metadata later
        sessionId: { type: String, index: true, unique: true, sparse: true },
        
        items: [CartItemSchema],
        
        status: {
            type: String,
            enum: ["active", "converted", "abandoned"],
            default: "active",
            index: true
        },
        
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export type CartType = InferSchemaType<typeof CartSchema> & { _id: mongoose.Types.ObjectId };
export const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
