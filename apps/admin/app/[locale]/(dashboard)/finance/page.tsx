import { FinanceStats } from "@/components/finance/finance-stats";
import { Button, ClippedAreaChart, HighlightedBarChart } from "@repo/ui";
import { getTranslations, setRequestLocale } from "@repo/i18n";
import { PageHeader } from "@/components/layout/headers/header-page";
import { Filter, FileDown, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="flex flex-col w-full min-h-screen pb-20">
            <PageHeader 
                title="المالية" 
                description="تتبع أداء المبيعات، الأرباح، والتحليلات البيانية المتقدمة"
                actions={
                  <div className="flex items-center gap-3">
                    <Link href={`/${locale}/finance/transactions`}>
                      <Button variant="ghost" className="h-11 px-5 text-muted-foreground hover:text-foreground gap-2 ">
                        <span>عرض جميع المعاملات</span>
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                      </Button>
                    </Link>
                    
                    <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
                      <Filter className="h-4 w-4" />
                      <span>تصفية</span>
                    </Button>
                    
                    <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
                      <FileDown className="h-4 w-4" />
                      <span>تصدير التقارير</span>
                    </Button>
                  </div>
                }
            />
            
            <div className="w-full px-6 lg:px-10 py-8 space-y-8">
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
        </div>
    );
}
