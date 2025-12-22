import { Suspense } from "react";
import { FinanceOverview, FinanceOverviewSkeleton } from "@/components/finance/finance-overview";
import { getTranslations, setRequestLocale } from "@repo/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.finance" });
    return {
        title: t("title"),
    };
}

export default async function FinancePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Admin.finance");

    return (
        <div className="flex flex-col h-full w-full space-y-6">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            </div>
            <Suspense fallback={<FinanceOverviewSkeleton />}>
                <FinanceOverview />
            </Suspense>
        </div>
    );
}
