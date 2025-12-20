import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getSession } from "@void/auth/server";
import { AuthContextClient } from "./auth-client";
import type { role } from "@void/auth";

export async function AuthProvider({ children }: { children: ReactNode }) {
  const session = await getSession();
  const locale = await getLocale();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const userRole = session.user.role as role;
  const isAuthorized = userRole === "admin" || userRole === "superadmin";

  if (!isAuthorized) {
    redirect(`/${locale}/forbidden`);
  }

  return (
    <AuthContextClient initialSession={session}>
      {children}
    </AuthContextClient>
  );
}