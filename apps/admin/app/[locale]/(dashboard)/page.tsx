import { Suspense } from "react";
import { DashboardStats, StatsSkeleton } from "@/components/dashboard/stats";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. تفعيل Static Rendering لهذه الصفحة بناءً على اللغة
  /* setRequestLocale(locale); */

  // 2. جلب الترجمات على السيرفر (Server-side Translation)
  const t = await getTranslations("Admin.dashboard");

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-6 pt-6">
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-3xl font-light tracking-tight text-foreground">
            {t("dashboardTitle")}
          </h2>
          <p className="text-muted-foreground font-light">
            {t("dashboardDesc")}
          </p>
        </div>

        {/* 
                   Dynamic Hole (Stats)
                   يتم تحميله لاحقاً عبر Streaming
                */}
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
      </div>
    </div>
  );
}
