import mongoose from "mongoose";
import type { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "void";

if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// 1. تعريف واجهة الكاش في الـ Global لضمان استمرارية الاتصال في الـ Dev Mode
interface GlobalMongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof globalThis & {
    mongoose?: GlobalMongoose;
};

if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = { conn: null, promise: null };
}

/**
 * الدالة الرئيسية للاتصال بـ Mongoose
 */
export async function connectDB(): Promise<typeof mongoose> {
    if (globalWithMongoose.mongoose!.conn) {
        return globalWithMongoose.mongoose!.conn;
    }

    if (!globalWithMongoose.mongoose!.promise) {
        const opts = {
            bufferCommands: false,
            dbName: dbName,
            autoIndex: true,
        };

        console.log("⏳ [DB] Connecting to MongoDB via Mongoose...");

        globalWithMongoose.mongoose!.promise = mongoose.connect(uri!, opts).then((m) => {
            console.log("✅ [DB] Connection established successfully.");
            return m;
        });
    }

    try {
        globalWithMongoose.mongoose!.conn = await globalWithMongoose.mongoose!.promise;
    } catch (e) {
        globalWithMongoose.mongoose!.promise = null;
        throw e;
    }

    return globalWithMongoose.mongoose!.conn;
}

/**
 * دالة مساعدة للحصول على Native DB Instance
 * (مهمة جداً لـ Better Auth)
 */
export async function getMongoDb(): Promise<Db> {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("Database instance not found after connection.");
    }
    return db;
}

/**
 * دالة مساعدة للحصول على MongoClient الأصلي
 */
export async function getMongoClient(): Promise<MongoClient> {
    await connectDB();
    return mongoose.connection.getClient() as unknown as MongoClient;
}