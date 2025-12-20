// apps\admin\app\[locale]\(dashboard)\layout.tsx

import React, { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@repo/ui";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getLocaleDir } from "@repo/i18n";
import { SiteHeader } from "@/components/layout/site-header";
import { UserNav, UserNavSkeleton } from "@/components/layout/user-nav";
import { AuthProvider } from "@/components/providers/auth-provider";
import { getSession } from "@void/auth/server";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const side = getLocaleDir(locale) === "rtl" ? "right" : "left";

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <Suspense fallback={<div className="flex h-screen w-full bg-background" />}>
        <AuthProvider>
          <AppSidebar side={side} />
          <SidebarInset className="flex flex-col h-screen">
            <SiteHeader
              userSlot={
                <Suspense fallback={<UserNavSkeleton />}>
                  <UserNavContainer />
                </Suspense>
              }
            />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </AuthProvider>
      </Suspense>
    </SidebarProvider>
  );
}

async function UserNavContainer() {
  const session = await getSession();
  if (!session?.user) return <UserNavSkeleton />;

  return <UserNav user={session.user} />;
}