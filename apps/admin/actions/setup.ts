"use server";

import { getDbSync } from "@void/db"; // Root export
import { auth } from "@void/auth";
import { headers, cookies } from "next/headers";
import { mark_initialized } from "@void/db";
import { seedDatabase } from "../lib/seed";

export async function initializeStore(formData: FormData) {
  // 1. Extract Data
  const storeName = formData.get("storeName") as string;
  const storeDescription = formData.get("storeDescription") as string;
  const storeLogo = formData.get("storeLogo") as string; // Optional

  const country = formData.get("country") as string;
  const city = formData.get("city") as string;
  const address = formData.get("address") as string;
  const storePhone = formData.get("storePhone") as string; // Optional
  const timezone = formData.get("timezone") as string;
  const currency = formData.get("currency") as string;

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const adminEmail = formData.get("email") as string;
  const adminMobile = formData.get("mobile") as string; // Optional
  const password = formData.get("password") as string;

  const shouldSeed = formData.get("shouldSeed") === "true";

  // 2. Check if already initialized
  const db = getDbSync();
  const settingsCol = db.collection("settings");
  const existing = await settingsCol.findOne({ _id: "store" as any });
  if (existing?.initialized) {
    return { error: "Store already initialized" };
  }

  try {
    // 3. Create Admin User
    const headerList = await headers();
    const fullName = `${firstName} ${lastName}`.trim();

    await auth.api.signUpEmail({
      body: {
        name: fullName,
        email: adminEmail,
        password: password,
      },
      headers: headerList,
    });

    // 3.5 Manually promote to admin & set extra fields
    const usersCol = db.collection("user");
    await usersCol.updateOne(
      { email: adminEmail },
      {
        $set: {
          role: "admin",
          phone: adminMobile,
        },
      }
    );

    // 4. Mark Initialized & Save Store Config
    await mark_initialized({
      store: {
        storeName,
        description: storeDescription,
        logo: storeLogo,
        currency,
        phone: storePhone,
        timezone,
        location: {
          country,
          city,
          address,
        },
      },
    });

    // 5. Seed Database
    if (shouldSeed) {
      await seedDatabase();
    }
  } catch (e) {
    console.error("Setup failed:", e);
    return { error: "Setup failed. Check logs." };
  }

  // Set a short-lived cookie to allow the client to show the success screen
  // without the layout redirecting immediately.
  const cookieStore = await cookies();
  cookieStore.set("setup_complete", "true", { maxAge: 10 });

  const redirectUrl = `/`;

  return { success: true, redirectUrl };
}
