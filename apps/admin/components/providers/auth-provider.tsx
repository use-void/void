import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getLocale } from "@repo/i18n";
import { getSession } from "@void/auth";
import { AuthContextClient } from "./auth-client";

export async function AuthGuard({ children }: { children: ReactNode }) {
  const session = await getSession();
  const locale = await getLocale();

  if (!session) redirect(`/${locale}/login`);

  const isAdmin = ["admin", "superadmin"].includes(session.user.role || "");
  if (!isAdmin) redirect(`/${locale}/forbidden`);

  return (
    <AuthContextClient initialSession={session}>
      {children}
    </AuthContextClient>
  );
}