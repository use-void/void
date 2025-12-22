import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { getTranslations } from "@repo/i18n";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

async function getFinanceData() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
        totalRevenue: "$150,230.50",
        monthlyRevenue: "$12,450.00",
        expenses: "$4,230.00",
        netProfit: "$8,220.00",
        transactions: [
             { id: 1, desc: "Payment from Client A", date: "2023-10-25", amount: "+$500.00", type: "income" },
             { id: 2, desc: "Server Costs", date: "2023-10-24", amount: "-$120.00", type: "expense" },
             { id: 3, desc: "Payment from Client B", date: "2023-10-23", amount: "+$1,200.00", type: "income" },
        ]
    };
}

export async function FinanceOverview() {
    const data = await getFinanceData();
    const t = await getTranslations("Admin.finance");

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card border-border rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalRevenue}</div>
                         <p className="text-xs text-muted-foreground">+20.1% {t('fromLastMonth')}</p>
                    </CardContent>
                </Card>
                 <Card className="bg-card border-border rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("monthlyRevenue")}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.monthlyRevenue}</div>
                           <p className="text-xs text-muted-foreground">+4.5% {t('fromLastMonth')}</p>
                    </CardContent>
                </Card>
                 <Card className="bg-card border-border rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">{t("expenses")}</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.expenses}</div>
                           <p className="text-xs text-muted-foreground">-1.2% {t('fromLastMonth')}</p>
                    </CardContent>
                </Card>
                  <Card className="bg-card border-border rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">{t("netProfit")}</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.netProfit}</div>
                         <p className="text-xs text-muted-foreground">+12% {t('fromLastMonth')}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card border-border rounded-xl">
                <CardHeader>
                    <CardTitle>{t("recentTransactions")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.transactions.map((transaction) => (
                             <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                                <div>
                                    <p className="font-medium">{transaction.desc}</p>
                                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                                </div>
                                 <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function FinanceOverviewSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-card border-border rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px] bg-muted" />
                            <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[120px] bg-muted mb-2" />
                             <Skeleton className="h-3 w-[80px] bg-muted/50" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card border-border rounded-xl">
                <CardHeader>
                    <Skeleton className="h-6 w-[200px] bg-muted" />
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                                <div className="space-y-2">
                                     <Skeleton className="h-4 w-[200px] bg-muted" />
                                     <Skeleton className="h-3 w-[100px] bg-muted/50" />
                                </div>
                                <Skeleton className="h-6 w-[80px] bg-muted" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
