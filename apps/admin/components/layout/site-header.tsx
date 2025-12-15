
import { Search, Bell } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";

interface SiteHeaderProps {
    userSlot: React.ReactNode;
}

export function SiteHeader({ userSlot }: SiteHeaderProps) {
    return (
        <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-4">
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
                    <div className="h-6 w-[1px] bg-border mx-1" />
                    <LanguageSwitcher />
                    {userSlot}
                </div>
            </div>
        </header>
    );
}