import { FinanceStats } from "@/components/finance/finance-stats";
import { FinancePageHeader } from "@/components/finance/finance-page-header";
import { ClippedAreaChart, HighlightedBarChart } from "@repo/ui";
import { getTranslations, setRequestLocale } from "@repo/i18n";

// Mock data for finance
const MOCK_FINANCE_STATS = {
  todaySales: "1,240",
  monthlySales: "45,800",
  totalSales: "890,450",
  netProfit: "312,200",
  todayChange: 12.5,
  monthlyChange: 5.4
};

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
    
    return (
        <div className="flex flex-col w-full space-y-8 pb-20">
            <FinancePageHeader 
                title="المالية" 
                description="تتبع أداء المبيعات، الأرباح، والتحليلات البيانية المتقدمة" 
            />
            
            {/* Stats Section */}
            <FinanceStats stats={MOCK_FINANCE_STATS} />
            
            {/* Charts Section - Row 1: Main Overviews */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
               <div className="md:col-span-8 flex flex-col">
                 <ClippedAreaChart />
               </div>
               <div className="md:col-span-4 flex flex-col">
                 <HighlightedBarChart />
               </div>
            </div>
        </div>
    );
}
