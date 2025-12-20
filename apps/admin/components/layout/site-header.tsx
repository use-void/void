import { Search, Bell } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";
import { SidebarTrigger, Separator } from "@repo/ui";

interface SiteHeaderProps {
  userSlot: React.ReactNode;
}

export function SiteHeader({ userSlot }: SiteHeaderProps) {
  return (
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center justify-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DashboardBreadcrumb />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50 w-64 focus-within:border-border-hover focus-within:text-foreground transition-colors">
          <Search size={16} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search..." // TODO: Localization
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground font-light"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
            <Bell size={18} strokeWidth={2} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background"></span>
          </button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <LanguageSwitcher />
          {userSlot}
        </div>
      </div>
    </header>
  );
}
