import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export { auth } from "./auth";
export * from "./permissions";
export { toNextJsHandler } from "better-auth/next-js";
export { getSessionCookie } from "better-auth/cookies";

export const getSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
});

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];