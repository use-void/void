"use server";

import { connectDB, Product, type ProductType } from "@void/db";
import { revalidatePath } from "next/cache";
import { redirect, forbidden } from "next/navigation";
import { Types } from "mongoose";
import { getSession } from "@void/auth";
import { can, type entity, type action } from "@void/auth";

// ✅ التصحيح هنا: أضفنا export لكي تستطيع الملفات الأخرى استيرادها
export interface SerializedProduct extends Omit<ProductType, "_id" | "createdAt" | "updatedAt"> {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ ونحتاج هذه أيضاً للـ Forms
export interface ProductInput {
  name: string;
  description?: string;
  price: string | number;
  compareAtPrice?: string | number;
  status?: "draft" | "active" | "archived";
  sku?: string;
  stock?: string | number;
}

// --- Helper Local ---
async function checkAuth(ent: entity, act: action) {
  const session = await getSession();
  
  if (!session || !can(session.user.role as any, ent, act)) {
    forbidden(); 
  }
  return session;
}

// دالة تحويل البيانات لتناسب المتصفح
function serialize(doc: any): SerializedProduct | null {
  if (!doc) return null;
  const data = doc.toObject ? doc.toObject() : doc;
  
  return {
    ...data,
    _id: data._id.toString(),
    createdAt: data.createdAt?.toISOString(),
    updatedAt: data.updatedAt?.toISOString(),
  } as SerializedProduct;
}

// ==========================================
//  READ ACTIONS
// ==========================================

export async function getProducts() {
  await checkAuth("products", "read");
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return products.map(serialize) as SerializedProduct[];
}

export async function getProductById(id: string) {
  await checkAuth("products", "read");
  if (!Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const product = await Product.findById(id).lean();
  return serialize(product);
}

// ==========================================
//  WRITE ACTIONS
// ==========================================

export async function createProduct(
  data: ProductInput,
  type: "physical" | "digital",
  locale: string
) {
  await checkAuth("products", "create");
  await connectDB();

  const productData = {
    name: data.name,
    slug: data.name.toLowerCase().trim().replace(/[\s+]+/g, "-"),
    description: data.description,
    price: Number(data.price),
    compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
    type,
    status: data.status || "draft",
    physicalDetails: type === "physical" ? {
      sku: data.sku,
      stock: Number(data.stock || 0),
    } : undefined,
  };

  await Product.create(productData);

  revalidatePath(`/${locale}/products`);
  redirect(`/${locale}/products`);
}

export async function updateProduct(
  id: string,
  data: ProductInput,
  locale: string
) {
  await checkAuth("products", "update");

  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");

  await connectDB();

  await Product.findByIdAndUpdate(id, {
      $set: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        status: data.status,
        "physicalDetails.sku": data.sku,
        "physicalDetails.stock": Number(data.stock || 0),
      },
    });

  revalidatePath(`/${locale}/products`);
  revalidatePath(`/${locale}/products/${id}`);
}