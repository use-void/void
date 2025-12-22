import { Suspense } from "react";
import { DashboardStats, StatsSkeleton } from "@/components/dashboard/stats";
import { HeroSection } from "@/components/dashboard/hero-section";
import { setRequestLocale } from '@repo/i18n'; 

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="flex flex-col h-full w-full space-y-6">
        <HeroSection />
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
    </div>
  );
}