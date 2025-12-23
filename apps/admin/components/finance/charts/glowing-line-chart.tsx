"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui";
import { Badge } from "@repo/ui";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "January", desktop: 186, mobile: 87 },
  { month: "February", desktop: 305, mobile: 163 },
  { month: "March", desktop: 237, mobile: 142 },
  { month: "April", desktop: 73, mobile: 195 },
  { month: "May", desktop: 209, mobile: 118 },
  { month: "June", desktop: 214, mobile: 231 },
];

const chartConfig = {
  desktop: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Target",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function GlowingLineChart() {
  return (
    <Card className="bg-card border-border rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="text-right">
        <CardTitle className="text-xl font-bold flex items-center justify-end gap-2">
          مخطط الأداء المتوهج
          <Badge
            variant="outline"
            className="text-emerald-500 bg-emerald-500/10 border-none"
          >
            <TrendingUp className="h-4 w-4 me-1" />
            <span>5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription>يناير - يونيو 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="hsl(var(--border) / 0.3)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="bump"
              stroke="hsl(var(--primary))"
              dot={false}
              strokeWidth={2}
              filter="url(#rainbow-line-glow)"
            />
            <Line
              dataKey="mobile"
              type="bump"
              stroke="hsl(var(--chart-5))"
              dot={false}
              strokeWidth={2}
              filter="url(#rainbow-line-glow)"
            />
            <defs>
              <filter
                id="rainbow-line-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
