import { Suspense } from "react";
import { DashboardStats, StatsSkeleton } from "@/components/dashboard/stats";
import { HeroSection } from "@/components/dashboard/hero-section";

export default function DashboardPage() {
  /*   params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params; */

  // 1. تفعيل Static Rendering لهذه الصفحة بناءً على اللغة
  /* setRequestLocale(locale); */

  // 2. جلب الترجمات على السيرفر (Server-side Translation)
  /* const t = await getTranslations("Admin.dashboard"); */

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-6 pt-6">
        <HeroSection />

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
