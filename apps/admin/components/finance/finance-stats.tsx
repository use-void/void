import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui"
import { TrendingUp, DollarSign, Wallet } from "lucide-react"

interface FinanceStatsProps {
  stats: {
    todaySales: string
    monthlySales: string
    totalSales: string
    netProfit: string
    todayChange: number
    monthlyChange: number
  }
}

export function FinanceStats({ stats }: FinanceStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Today Sales */}
      <Card className="bg-card border-border  overflow-hidden group hover:border-primary/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="text-right">
            <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">مبيعات اليوم</CardTitle>
          </div>
          <div className="p-2.5 bg-primary/10 ">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-foreground tabular-nums">
            {stats.todaySales} <span className="text-sm font-medium text-muted-foreground ms-0.5">ر.س</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 text-xs font-black">+{stats.todayChange}%</span>
            </div>
            <span className="text-[10px] text-muted-foreground">عن أمس</span>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Sales */}
      <Card className="bg-card border-border  overflow-hidden group hover:border-blue-500/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="text-right">
            <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">مبيعات الشهر</CardTitle>
          </div>
          <div className="p-2.5 bg-blue-500/10 ">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-foreground tabular-nums">
            {stats.monthlySales} <span className="text-sm font-medium text-muted-foreground ms-0.5">ر.س</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 text-xs font-black">+{stats.monthlyChange}%</span>
            </div>
            <span className="text-[10px] text-muted-foreground">عن الشهر الماضي</span>
          </div>
        </CardContent>
      </Card>

      {/* Net Profit */}
      <Card className="bg-card border-border  overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="text-right">
            <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">صافي الأرباح</CardTitle>
          </div>
          <div className="p-2.5 bg-emerald-500/10 ">
            <Wallet className="h-5 w-5 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-foreground tabular-nums">
            {stats.netProfit} <span className="text-sm font-medium text-muted-foreground ms-0.5">ر.س</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-[10px] text-emerald-500 font-bold">نمو مستقر</span>
            <span className="text-[10px] text-muted-foreground italic truncate max-w-[100px]">&quot;أداء مذهل!&quot;</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Sales */}
      <Card className="bg-card border-border  overflow-hidden group hover:border-orange-500/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="text-right">
            <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">إجمالي المبيعات</CardTitle>
          </div>
          <div className="p-2.5 bg-orange-500/10 ">
            <DollarSign className="h-5 w-5 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-foreground tabular-nums">
            {stats.totalSales} <span className="text-sm font-medium text-muted-foreground ms-0.5">ر.س</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center">
            <span className="text-[10px] text-muted-foreground">تراكمي منذ البداية</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
