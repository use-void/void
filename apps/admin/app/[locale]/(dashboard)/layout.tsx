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
    <SidebarProvider>
      <AppSidebar side={side} />
      <SidebarInset className="bg-background min-h-screen flex flex-col transition-all duration-300">
        <SiteHeader
          userSlot={
            <Suspense fallback={<UserNavSkeleton />}>
              <RenderWithUser Component={UserNav} />
            </Suspense>
          }
        />

        <Suspense fallback={null}>
          <RequireAuth>
            <main className="flex-1 overflow-x-hidden p-6">{children}</main>
          </RequireAuth>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
