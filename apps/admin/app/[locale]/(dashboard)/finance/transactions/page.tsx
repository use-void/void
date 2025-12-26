import { PageHeader } from "@/components/layout/headers/header-page";
import { Button } from "@repo/ui";
import { TransactionTable } from "@/components/finance/transaction-table";
import { Filter, FileDown } from "lucide-react";
import { setRequestLocale } from "@repo/i18n";

// Mock data for transactions (reused)
const MOCK_TRANSACTIONS = [
  {
    id: "TRX-1092",
    type: "income" as const,
    customer: "أحمد العتيبي",
    date: "اليوم، 10:45 ص",
    amount: "150.00",
    status: "ناجحة"
  },
  {
    id: "TRX-1091",
    type: "income" as const,
    customer: "سارة القحطاني",
    date: "اليوم، 09:20 ص",
    amount: "450.00",
    status: "ناجحة"
  },
  {
    id: "TRX-1090",
    type: "payout" as const,
    customer: "سحب أرباح للمحفظة",
    date: "أمس، 08:30 م",
    amount: "2,000.00",
    status: "ناجحة"
  },
  {
    id: "TRX-1089",
    type: "income" as const,
    customer: "خالد بن الوليد",
    date: "أمس، 02:15 م",
    amount: "890.00",
    status: "قيد المعالجة"
  },
  {
    id: "TRX-1088",
    type: "income" as const,
    customer: "نورة القحطاني",
    date: "22 ديسمبر، 11:30 ص",
    amount: "1,200.00",
    status: "فاشلة"
  }
];

export async function generateMetadata() {
    return {
        title: "المعاملات المالية",
    };
}

export default async function TransactionsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    
    return (
        <div className="flex flex-col w-full min-h-screen pb-20">
            <PageHeader 
                title="المعاملات المالية" 
                description="سجل كامل بجميع الحركات المالية والتحويلات"
                actions={
                  <div className="flex items-center gap-3">
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
            
            <div className="w-full px-6 lg:px-10 py-8">
                <TransactionTable transactions={MOCK_TRANSACTIONS} />
            </div>
        </div>
    );
}
