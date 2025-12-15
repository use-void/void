import mongoose from "mongoose";
import { getMongoUri, getDbName } from "./client";

// Cache the mongoose connection to avoid multiple connections in Dev mode (Hot Reload)
const globalAny = globalThis as unknown as { mongoose: { conn: any; promise: any } };

let cached = globalAny.mongoose;

if (!cached) {
    cached = globalAny.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: getDbName(),
        };

        cached.promise = mongoose.connect(getMongoUri(), opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}