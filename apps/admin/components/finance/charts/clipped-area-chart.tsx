"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { ChartConfig, ChartContainer } from "@repo/ui";
import { Badge } from "@repo/ui";
import { TrendingDown } from "lucide-react";
import { useRef, useState } from "react";
import { useSpring, useMotionValueEvent } from "framer-motion";

const chartData = [
  { month: "January", mobile: 245 },
  { month: "February", mobile: 654 },
  { month: "March", mobile: 387 },
  { month: "April", mobile: 521 },
  { month: "May", mobile: 412 },
  { month: "June", mobile: 598 },
  { month: "July", mobile: 312 },
  { month: "August", mobile: 743 },
  { month: "September", mobile: 489 },
  { month: "October", mobile: 476 },
  { month: "November", mobile: 687 },
  { month: "December", mobile: 198 },
];

const chartConfig = {
  mobile: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ClippedAreaChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState(0);

  // motion values
  const springX = useSpring(0, {
    damping: 30,
    stiffness: 100,
  });
  const springY = useSpring(0, {
    damping: 30,
    stiffness: 100,
  });

  useMotionValueEvent(springX, "change", (latest) => {
    setAxis(latest);
  });

  return (
    <Card className="bg-card border-border rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="text-right">
        <CardTitle className="text-2xl font-bold flex items-center justify-end gap-2 text-foreground">
          {springY.get().toFixed(0)} <span className="text-sm font-normal text-muted-foreground">ر.س</span>
          <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-500">
            <TrendingDown className="h-3 w-3 me-1" />
            <span>-5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription className="text-muted-foreground">إجمالي الإيرادات للسنة الماضية</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          ref={chartRef}
          className="h-54 w-full"
          config={chartConfig}
        >
          <AreaChart
            className="overflow-visible"
            accessibilityLayer
            data={chartData}
            onMouseMove={(state) => {
              const x = state.activeCoordinate?.x;
              const dataValue = state.activePayload?.[0]?.value;
              if (x && typeof dataValue === 'number') {
                springX.set(x);
                springY.set(dataValue);
              }
            }}
            onMouseLeave={() => {
              const rect = chartRef.current?.getBoundingClientRect();
              springX.set(rect?.width || 0);
              springY.set(chartData[chartData.length - 1]?.mobile ?? 0);
            }}
            margin={{
              right: 0,
              left: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border) / 0.3)"
              horizontalCoordinatesGenerator={(props: { height: number }) => {
                const { height } = props;
                return [0, height - 30];
              }}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-xs text-muted-foreground"
            />
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#gradient-cliped-area-mobile)"
              fillOpacity={0.4}
              stroke="hsl(var(--primary))"
              clipPath={`inset(0 ${
                Number(chartRef.current?.getBoundingClientRect().width) - axis
              } 0 0)`}
            />
            <line
              x1={axis}
              y1={0}
              x2={axis}
              y2={"85%"}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeOpacity={0.2}
            />
            <rect
              x={axis - 50}
              y={0}
              width={50}
              height={18}
              fill="hsl(var(--primary))"
            />
            <text
              x={axis - 25}
              fontWeight={600}
              y={13}
              textAnchor="middle"
              fill="hsl(var(--primary-foreground))"
              className="text-[10px]"
            >
              {springY.get().toFixed(0)}
            </text>
            {/* this is a ghost line behind graph */}
            <Area
              dataKey="mobile"
              type="monotone"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeOpacity={0.1}
            />
            <defs>
              <linearGradient
                id="gradient-cliped-area-mobile"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
                <mask id="mask-cliped-area-chart">
                  <rect
                    x={0}
                    y={0}
                    width={"50%"}
                    height={"100%"}
                    fill="white"
                  />
                </mask>
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
