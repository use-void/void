"use server";

import { connectDB, StoreConfig } from "@void/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { StoreConfigSchema, type StoreConfigFormValues } from "../schemas/store-config.schema";

// --- Actions ---

export async function getStoreConfig() {
    try {
        await headers();
        await connectDB();
        // Since we use capsule: { max: 1 }, we can just findOne
        let config = await StoreConfig.findOne({}).lean();
        
        if (!config) {
            // Create a default one if it doesn't exist
            config = await StoreConfig.create({
                name: { en: "My Store", ar: "متجري" },
                description: { en: "Welcome to our store", ar: "مرحباً بكم في متجرنا" },
                localization: {
                    defaultLanguage: "en",
                    languages: [
                        { code: "en", name: "English", isActive: true, isRTL: false },
                        { code: "ar", name: "العربية", isActive: true, isRTL: true }
                    ]
                },
                financials: {
                    defaultCurrency: "USD",
                    currencies: [
                        { code: "USD", symbol: { en: "$", ar: "دولار" }, isActive: true }
                    ]
                }
            });
            return JSON.parse(JSON.stringify(config));
        }

        return JSON.parse(JSON.stringify(config));
    } catch (error) {
        console.error("Failed to fetch store config:", error);
        throw new Error("Failed to fetch store configuration");
    }
}

export async function updateStoreConfig(data: StoreConfigFormValues) {
    try {
        // Validate data
        console.log("Updating store config with data:", JSON.stringify(data, null, 2));
        const validatedData = StoreConfigSchema.parse(data);

        await connectDB();
        
        const result = await StoreConfig.findOneAndUpdate(
            {}, 
            { $set: validatedData },
            { upsert: true, new: true, runValidators: true }
        );

        revalidatePath("/(dashboard)/settings", "layout");
        revalidatePath("/", "layout"); 

        console.log("Store config updated successfully");
        return { success: true, data: JSON.parse(JSON.stringify(result)) };
    } catch (error) {
        console.error("Failed to update store config:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: "Validation failed", details: error.issues };
        }
        return { success: false, error: "Failed to update store configuration" };
    }
}
