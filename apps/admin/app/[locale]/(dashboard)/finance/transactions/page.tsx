import { TransactionTable } from "@/components/finance/transaction-table";
import { FinancePageHeader } from "@/components/finance/finance-page-header";
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
        <div className="flex flex-col w-full pb-20">
            <FinancePageHeader 
                title="المعاملات المالية" 
                description="سجل كامل بجميع الحركات المالية والتحويلات" 
            />
            
            <TransactionTable transactions={MOCK_TRANSACTIONS} />
        </div>
    );
}
