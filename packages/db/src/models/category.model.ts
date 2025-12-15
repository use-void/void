import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: String,
        image: String,
    },
    { timestamps: true }
);

export type CategoryType = InferSchemaType<typeof CategorySchema> & { _id: mongoose.Types.ObjectId };
export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
