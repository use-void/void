import { getDbSync } from "./index";

type SettingsDoc = {
    _id: string;
    initialized?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    store?: Record<string, unknown>;
    contacts?: Record<string, unknown>;
    social?: Record<string, unknown>;
    notes?: string;
};

export async function is_initialized() {
    const db = getDbSync();
    const col = db.collection<SettingsDoc>("settings");
    const doc = await col.findOne({ _id: "store" });
    return !!doc?.initialized;
}

export async function mark_initialized(payload: Record<string, unknown>) {
    const db = getDbSync();
    const col = db.collection<SettingsDoc>("settings");
    await col.updateOne(
        { _id: "store" },
        {
            $set: {
                ...payload,
                initialized: true,
                updatedAt: new Date()
            },
            $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
    );
}
