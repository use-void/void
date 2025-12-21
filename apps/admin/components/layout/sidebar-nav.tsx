"use client";

import { usePathname, Link } from "@repo/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Users,
  FileText,
  CreditCard,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui";

// البيانات هنا فقط
const items = [
  { title: "dashboard", url: "/", icon: LayoutDashboard },
  { title: "products", url: "/products", icon: Package },
  { title: "orders", url: "/orders", icon: ShoppingCart },
  { title: "customers", url: "/customers", icon: Users },
  { title: "finance", url: "/finance", icon: CreditCard },
  { title: "content", url: "/blog", icon: FileText },
];

const bottomItems = [{ title: "settings", url: "/settings", icon: Settings }];

export function SidebarNav() {
  // هذا هو المكان الوحيد الذي "يعرف" الرابط
  const pathname = usePathname();
  const t = useTranslations("Admin.sidebar");
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {items.map((item) => {
              const isActive =
                item.url === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative h-11
                      ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground border border-transparent hover:border-sidebar-border"
                      }
                    `}
                    render={
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-foreground rounded-l-full" />
                        )}
                        <item.icon
                          size={20}
                          strokeWidth={1.5}
                          className={`${isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"}`}
                        />
                        <span className="text-sm font-medium tracking-wide">
                          {t(item.title)}
                        </span>
                      </Link>
                    }
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <div className="mt-auto pb-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {bottomItems.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative h-11
                        ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-sm"
                            : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground border border-transparent hover:border-sidebar-border"
                        }
                      `}
                      render={
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 w-full"
                          onClick={() => isMobile && setOpenMobile(false)}
                        >
                          {isActive && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-foreground rounded-l-full" />
                          )}
                          <item.icon
                            size={20}
                            strokeWidth={1.5}
                            className={`${isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"}`}
                          />
                          <span className="text-sm font-medium tracking-wide">
                            {t(item.title)}
                          </span>
                        </Link>
                      }
                    ></SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </>
  );
}

export function SidebarNavSkeleton() {
  return (
    <>
      <div className="space-y-2 mt-2 px-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-11 w-full bg-sidebar-accent/5 rounded-lg animate-pulse flex items-center px-3 gap-3"
          >
            <div className="w-5 h-5 rounded-md bg-sidebar-accent/10" />
            <div className="h-3 w-24 rounded bg-sidebar-accent/10" />
          </div>
        ))}
      </div>
      <div className="mt-auto pb-6 px-2">
        <div className="h-11 w-full bg-sidebar-accent/5 rounded-lg animate-pulse flex items-center px-3 gap-3">
          <div className="w-5 h-5 rounded-md bg-sidebar-accent/10" />
          <div className="h-3 w-24 rounded bg-sidebar-accent/10" />
        </div>
      </div>
    </>
  );
}