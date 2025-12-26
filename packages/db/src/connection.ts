import mongoose from "mongoose";
import type { Db, MongoClient } from "mongodb";

// Top-level env access removed to support delayed loading
// const uri = process.env.MONGODB_URI;
// const dbName = process.env.MONGODB_DB || "void";

// 1. Define Cache Interface in Global
interface GlobalMongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// @ts-ignore
const globalWithMongoose = global as typeof globalThis & {
    mongoose?: GlobalMongoose;
};

if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = { conn: null, promise: null };
}

/**
 * Main Mongoose Connection Function
 */
export async function connectDB(): Promise<typeof mongoose> {
    if (globalWithMongoose.mongoose!.conn) {
        return globalWithMongoose.mongoose!.conn;
    }

    if (!globalWithMongoose.mongoose!.promise) {
        const uri = process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB || "void";

        if (!uri) {
            throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
        }

        const opts = {
            bufferCommands: false,
            dbName: dbName,
            autoIndex: true,
        };

        console.log("⏳ [DB] Connecting to MongoDB via Mongoose...");

        globalWithMongoose.mongoose!.promise = mongoose.connect(uri, opts).then((m) => {
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

// Alias for consistency with other parts of the app
export const connectToDatabase = connectDB;

/**
 * Helper to get Native DB Instance
 */
export async function getMongoDb(): Promise<Db> {
    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
        throw new Error("Database instance not found after connection.");
    }
    
    // Cast to Db logic
    return db as Db;
}

/**
 * Helper to get Native MongoClient
 */
export async function getMongoClient(): Promise<MongoClient> {
    await connectDB();
    return mongoose.connection.getClient() as unknown as MongoClient;
}