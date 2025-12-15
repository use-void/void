import { auth } from "@void/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { can, role, entity, action } from "@void/auth";

export async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

export async function requireAuth(locale: string) {
    const session = await getSession();

    if (!session) {
        redirect(`/${locale}/login`);
    }

    return session;
}

export async function redirectIfAuthenticated(locale: string) {
    const session = await getSession();

    if (session) {
        redirect(`/${locale}`);
    }
}

export async function verifyPermission(resource: entity, act: action) {
    const session = await getSession();
    const userRole = (session?.user?.role || "user") as role;

    if (!can(userRole, resource, act)) {
        throw new Error("Unauthorized");
    }

    return session;
}
