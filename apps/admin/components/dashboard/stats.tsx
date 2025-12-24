import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { DollarSign, Users, Package, Activity } from "lucide-react";
import { getTranslations } from "@repo/i18n";

// محاكاة تأخير الشبكة لإظهار الـ Skeleton (إثبات الـ Streaming)
async function getData() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
        revenue: "$45,231.89",
        users: "2,350",
        products: "122",
        active: "573"
    };
}

export async function DashboardStats() {
    const data = await getData();
    const t = await getTranslations("Admin.dashboard.stats");

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title={t('totalRevenue')}
                value={data.revenue}
                change={`+20.1% a${t('change.fromLastMonth')}`}
                icon={<DollarSign className="h-4 w-4 text-foreground" />}
            />
            <StatCard
                title={t('activeUsers')}
                value={data.users}
                change={`+180.1% ${t('change.fromLastMonth')}`}
                icon={<Users className="h-4 w-4 text-foreground" />}
            />
            <StatCard
                title={t('products')}
                value={data.products}
                change={`+12 ${t('change.newProducts')}`}
                icon={<Package className="h-4 w-4 text-foreground" />}
            />
            <StatCard
                title={t('activeNow')}
                value={data.active}
                change={`+201 ${t('change.sinceLastHour')}`}
                icon={<Activity className="h-4 w-4 text-foreground" />}
            />
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className=" border border-border bg-card p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-[100px] bg-muted" />
                        <Skeleton className="h-8 w-8 bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-[120px] bg-muted" />
                        <Skeleton className="h-3 w-[80px] bg-muted/50" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatCard({ title, value, change, icon }: any) {
    return (
        <Card className="bg-card border-border  hover:border-border-hover transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="h-8 w-8  bg-secondary border border-border flex items-center justify-center">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-normal text-foreground tracking-tight">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {change}
                </p>
            </CardContent>
        </Card>
    );
}