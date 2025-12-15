import React, { ComponentType } from "react";
import { getCachedSession } from "@/lib/cached-auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

/**
 * Reusable wrapper that fetches the current user and passes it to the component.
 * If no user is found, it renders properties falling back or null.
 */
export async function RenderWithUser({
    Component,
    fallback = null
}: {
    Component: ComponentType<{ user: any }>;
    fallback?: React.ReactNode;
}) {
    const session = await getCachedSession();
    const user = session?.user;

    if (!user) return fallback;

    return <Component user={user} />;
}

/**
 * Auth Guard Component that redirects if not authenticated.
 * It renders children only if the user is an admin/superadmin.
 */
export async function RequireAuth({ children }: { children: React.ReactNode }) {
    const session = await getCachedSession();
    const locale = await getLocale();

    if (!session) {
        redirect(`/${locale}/login`);
    }

    const { user } = session;
    const role = (user as any).role;

    if (role !== "admin" && role !== "superadmin") {
        redirect(`/${locale}`);
    }

    return children;
}
