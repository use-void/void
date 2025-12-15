import { getDbSync } from "@void/db";
import { cacheLife, cacheTag } from "next/cache";

export async function checkSetupStatus(): Promise<boolean> {
    "use cache";
    cacheLife("minutes");
    cacheTag("setup-status");

    try {
        const db = getDbSync();
        const col = db.collection("settings");
        const doc = await col.findOne({ _id: "store" as any });
        return !!doc?.initialized;
    } catch (error) {
        console.error("Failed to check setup status:", error);
        return false;
    }
}
