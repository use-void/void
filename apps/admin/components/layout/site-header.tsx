import { Suspense } from "react";
import { Search } from "lucide-react";
import { SidebarTrigger, Separator } from "@repo/ui";
import { LanguageSwitcher } from "./language-switcher";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";
import { UserNav, UserNavSkeleton } from "./user-nav";
import { getSession } from "@void/auth";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
                <Suspense fallback={<div className="h-5 w-32 bg-zinc-100/10 rounded animate-pulse" />}>
            <DashboardBreadcrumb />
        </Suspense>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50 w-64">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-full" 
          />
        </div>

        <div className="flex items-center gap-3">
          <Suspense fallback={<div className="h-8 w-8 bg-zinc-100/10 rounded animate-pulse" />}>
            <LanguageSwitcher />
          </Suspense>
          
          <Suspense fallback={<UserNavSkeleton />}>
            <UserNavFetcher />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

async function UserNavFetcher() {
  const session = await getSession();
  if (!session?.user) return <UserNavSkeleton />;
  return <UserNav user={session.user} />;
}