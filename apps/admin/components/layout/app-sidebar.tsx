"use client";

import * as React from "react";
import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui";
// استيراد المكون المعزول والسكيلتون الخاص به
import { SidebarNav, SidebarNavSkeleton } from "./sidebar-nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // لاحظ: لا يوجد usePathname هنا نهائياً!
  // هذا المكون مستقل تماماً عن الرابط الآن.

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
        {/* العزل التام: نغلف المكون الديناميكي بـ Suspense */}
        {/* هذا يضمن أن السايدبار الرئيسي يتم تحميله فوراً، وفقط القوائم تنتظر قليلاً إذا لزم الأمر */}
        <Suspense fallback={<SidebarNavSkeleton />}>
          <SidebarNav />
        </Suspense>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}