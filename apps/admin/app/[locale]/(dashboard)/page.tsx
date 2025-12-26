import { Suspense } from "react";
import { DashboardStats, StatsSkeleton } from "@/components/dashboard/stats";
import { setRequestLocale } from '@repo/i18n'; 

import { PageHeader } from "@/components/layout/headers/header-page";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="flex flex-col w-full min-h-screen pb-20">
        <PageHeader 
            title="Dashboard" 
            description="Overview of your store performance." 
        />
        <div className="w-full px-6 lg:px-10 py-8 space-y-10">
            <Suspense fallback={<StatsSkeleton />}>
            <DashboardStats />
            </Suspense>
        </div>
    </div>
  );
}