import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { TransactionsTable } from "@/components/finance";

const mockTransactions = [
    {
        id: "TXN-1001",
        amount: 250.00,
        type: "payment" as const,
        status: "succeeded" as const,
        date: new Date().toISOString(),
        description: "Order #ORD-1234"
    },
    {
        id: "TXN-1002",
        amount: 50.00,
        type: "refund" as const,
        status: "succeeded" as const,
        date: new Date(Date.now() - 3600000).toISOString(),
        description: "Refund for #ORD-1100"
    },
    {
        id: "TXN-1003",
        amount: 1200.00,
        type: "payout" as const,
        status: "pending" as const,
        date: new Date(Date.now() - 7200000).toISOString(),
        description: "Scheduled Payout"
    }
];

export default async function TransactionsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.finance');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">
                        Transactions
                    </h2>
                    <p className="text-zinc-500 font-light">
                        View and manage all financial transactions.
                    </p>
                </div>
                <Suspense fallback={<div className="text-muted-foreground">Loading transactions...</div>}>
                    <TransactionsTable data={mockTransactions} />
                </Suspense>
            </div>
        </div>
    );
}
