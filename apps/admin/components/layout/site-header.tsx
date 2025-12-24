import { Suspense } from "react";
import { SidebarTrigger } from "@repo/ui";
import { LanguageSwitcher } from "./language-switcher";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";
import { UserNav, UserNavSkeleton } from "./user-nav";
import { NotificationsNav } from "./notifications-nav";
import { getSession } from "@void/auth";
import { ModeToggle } from "@repo/ui";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <div className="h-4 w-px bg-border mx-2 self-center" />
        <Suspense fallback={<BreadcrumbSkeleton />}>
          <DashboardBreadcrumb />
        </Suspense>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Suspense fallback={<LanguageSwitcherSkeleton />}>
            <LanguageSwitcher />
          </Suspense>

          <ModeToggle />

          <div className="h-4 w-px bg-border mx-2 self-center" />
          
          <NotificationsNav />

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

  // 🔥 الحل الذكي: تنظيف الكائن قبل إرساله للمتصفح
  // هذا يحول الـ Buffer IDs والـ Dates إلى Strings مقبولة
  const plainUser = JSON.parse(JSON.stringify(session.user));

  return <UserNav user={plainUser} />;
}

// --- Skeletons ---

function BreadcrumbSkeleton() {
  return (
    <div className="hidden md:flex items-center gap-2">
      <div className="h-4 w-16 bg-zinc-800/50 animate-pulse" />
      <span className="text-zinc-800">/</span>
      <div className="h-4 w-24 bg-zinc-800/50 animate-pulse" />
    </div>
  );
}

function LanguageSwitcherSkeleton() {
  return (
    <div className="h-9 w-9 bg-zinc-800/50  animate-pulse" />
  );
}