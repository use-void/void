import mongoose, { Schema, type InferSchemaType } from "mongoose";

const LocalizedString = {
    type: Map,
    of: String,
    required: true
};

const CategorySchema = new Schema(
    {
        name: LocalizedString,
        slug: { type: String, required: true, unique: true },
        description: { type: Map, of: String },
        image: String,
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

export type CategoryType = InferSchemaType<typeof CategorySchema> & { _id: mongoose.Types.ObjectId };
export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
