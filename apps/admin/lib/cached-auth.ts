import { auth } from "@void/auth/server";
import { headers } from "next/headers";
import { cacheTag } from "next/cache";

export async function getCachedSession() {
    'use cache: private';
    cacheTag('session');

    return await auth.api.getSession({
        headers: await headers()
    });
}
