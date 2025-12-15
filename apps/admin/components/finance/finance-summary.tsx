"use client";

import { DollarSign, TrendingUp, CreditCard, Activity } from "lucide-react";
import { cn } from "@repo/ui";

export function FinanceSummary() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
                title="Total Revenue"
                value="$45,231.89"
                change="+20.1% from last month"
                icon={DollarSign}
            />
            <StatCard
                title="Net Profit"
                value="$38,400.00"
                change="+15.2% from last month"
                icon={TrendingUp}
            />
            <StatCard
                title="Active Subscriptions"
                value="2,340"
                change="+180 since last hour"
                icon={Activity}
            />
            <StatCard
                title="Pending Payouts"
                value="$1,250.00"
                change="Processing..."
                icon={CreditCard}
            />
        </div>
    );
}

function StatCard({ title, value, change, icon: Icon }: any) {
    return (
        <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <span className="text-2xl font-bold text-foreground">{value}</span>
                <p className="text-xs text-muted-foreground">{change}</p>
            </div>
        </div>
    );
}
