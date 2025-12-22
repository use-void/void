"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "@repo/i18n";
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
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@repo/ui";

const items = [
  { title: "dashboard", url: "/", icon: LayoutDashboard },
  { title: "products", url: "/products", icon: Package },
  { title: "orders", url: "/orders", icon: ShoppingCart },
  { title: "customers", url: "/customers", icon: Users },
  { title: "finance", url: "/finance", icon: CreditCard },
  { title: "content", url: "/blog", icon: FileText },
];

const bottomItems = [{ title: "settings", url: "/settings", icon: Settings }];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  locale: string;
}

export function AppSidebar({ locale, ...props }: AppSidebarProps) {
  const t = useTranslations("Admin.sidebar");
  const { isMobile, setOpenMobile } = useSidebar();
  
  // الحالة لتخزين المسار الحالي
  const [currentPath, setCurrentPath] = React.useState("");

  // دالة مساعدة لاستخراج المسار النظيف (بدون locale)
  const getCleanPath = React.useCallback(() => {
    if (typeof window === "undefined") return "";
    let path = window.location.pathname;
    const prefix = `/${locale}`;
    if (path.startsWith(prefix)) {
      path = path.replace(prefix, "") || "/";
    }
    return path;
  }, [locale]);

  React.useEffect(() => {
    // 1. تحديد المسار عند تحميل الصفحة لأول مرة
    setCurrentPath(getCleanPath());

    // 2. الاستماع لزر الرجوع/التقدم في المتصفح (Browser Back/Forward)
    const handlePopState = () => {
      setCurrentPath(getCleanPath());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [getCleanPath]);

  // دالة التعامل مع الضغط على الرابط
  const handleLinkClick = (url: string) => {
    // تحديث الحالة فوراً لإعطاء استجابة بصرية سريعة
    setCurrentPath(url);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isItemActive = (url: string) => {
    if (!currentPath) return false;
    if (url === "/") return currentPath === "/";
    return currentPath.startsWith(url);
  };

  const createHref = (url: string) => {
    if (url === "/") return `/${locale}`;
    return `/${locale}${url}`;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="items-center justify-center h-32">
        <div className="w-10 h-10 bg-sidebar-foreground rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <span className="font-bold text-sidebar text-sm tracking-tighter">
            NR
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = isItemActive(item.url);
                const localizedTitle = t(item.title);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative h-11
                        ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground border border-transparent hover:border-sidebar-border"
                        }
                      `}
                      render={
                        <Link
                          href={createHref(item.url)}
                          className="flex items-center gap-3 w-full"
                          // ✅ التغيير الجوهري هنا: تحديث الحالة يدوياً عند الضغط
                          onClick={() => handleLinkClick(item.url)}
                          prefetch={false}
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
                            {localizedTitle}
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
                  const isActive = isItemActive(item.url);
                  const localizedTitle = t(item.title);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative h-11
                            ${
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground border border-transparent hover:border-sidebar-border"
                            }
                        `}
                        render={
                          <Link
                            href={createHref(item.url)}
                            className="flex items-center gap-3 w-full"
                            // ✅ تحديث الحالة يدوياً هنا أيضاً
                            onClick={() => handleLinkClick(item.url)}
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
                              {localizedTitle}
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
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}