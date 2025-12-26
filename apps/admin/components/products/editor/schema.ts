import { z } from "zod";
import { ProductType } from "@/types/product";

export const ProductContentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const ProductPricingSchema = z.object({
  price: z.string().min(1, "Price is required"),
  compareAtPrice: z.string().optional(),
  cost: z.string().optional(),
});

export const ProductInventorySchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  trackQuantity: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
});

export const ProductShippingSchema = z.object({
  weight: z.string().optional(),
  unit: z.enum(["kg", "lb", "g", "oz"]).default("kg"),
});

export const ProductSchema = z.object({
  type: z.enum(["physical", "digital"] as const),
  status: z.enum(["active", "draft"] as const),
  content: z.record(z.string(), ProductContentSchema),
  pricing: ProductPricingSchema,
  inventory: ProductInventorySchema,
  shipping: ProductShippingSchema,
  image: z.string().nullable().optional(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;
