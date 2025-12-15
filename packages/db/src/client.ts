import { MongoClient, ServerApiVersion } from "mongodb";

const options = {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    maxPoolSize: 10,
    minPoolSize: 5,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
};

const globalAny = globalThis as unknown as { __mongoClient?: MongoClient };
let _client: MongoClient | null = globalAny.__mongoClient ?? null;

export function getMongoUri() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI");
    return uri;
}

export function getDbName() {
    return process.env.MONGODB_DB || "void";
}

export function getClientSync() {
    if (!_client) {
        _client = new MongoClient(getMongoUri(), options);
        if (process.env.NODE_ENV !== "production") {
            globalAny.__mongoClient = _client;
        }
    }
    return _client;
}

// هذه الدالة التي يبحث عنها Better Auth
export function getDbSync() {
    return getClientSync().db(getDbName());
}

export async function getClient() {
    return getClientSync().connect();
}

export async function getDb() {
    const c = await getClient();
    return c.db(getDbName());
}