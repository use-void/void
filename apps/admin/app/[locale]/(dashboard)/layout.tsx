import React, { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@repo/ui";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getLocaleDir } from "@repo/i18n";
import { UserNav, UserNavSkeleton } from "@/components/layout/user-nav";
import { SiteHeader } from "@/components/layout/site-header";
import {
  RenderWithUser,
  RequireAuth,
} from "@/components/providers/session-provider";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const dir = getLocaleDir(locale);
  const side = dir === "rtl" ? "right" : "left";

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar side={side} />
      <SidebarInset className="flex flex-col h-screen">
        <SiteHeader
          userSlot={
            <Suspense fallback={<UserNavSkeleton />}>
              <RenderWithUser Component={UserNav} />
            </Suspense>
          }
        />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={null}>
            <RequireAuth>{children}</RequireAuth>
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
