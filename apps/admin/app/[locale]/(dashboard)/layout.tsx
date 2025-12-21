import { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@repo/ui";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getLocaleDir, setRequestLocale } from "@repo/i18n";
import { SiteHeader } from "@/components/layout/site-header";
import { AuthGuard } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  setRequestLocale(locale);
  
  const side = getLocaleDir(locale) === "rtl" ? "right" : "left";

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <Suspense fallback={<div className="w-[250px] h-full bg-zinc-900 border-r border-zinc-800" />}>
        <AppSidebar side={side} />
      </Suspense>

      <SidebarInset className="flex flex-col h-screen">
        <SiteHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={
             <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
             </div>
          }>
            <AuthGuard>{children}</AuthGuard>
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}