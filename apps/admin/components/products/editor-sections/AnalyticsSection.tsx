"use client"

import { BarChart3, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@repo/ui"

interface AnalyticsSectionProps {
  productId?: string;
}

export function AnalyticsSection({ productId }: AnalyticsSectionProps) {
  if (!productId) return null;

  return (
    <Card className=" border-border overflow-hidden bg-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Snapshot
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between p-2.5 bg-background  border border-border/50">
          <span className="text-xs text-muted-foreground font-medium">Views</span>
          <span className="text-sm font-bold">1,284</span>
        </div>
        <div className="flex items-center justify-between p-2.5 bg-background  border border-border/50">
          <span className="text-xs text-muted-foreground font-medium">Orders</span>
          <span className="text-sm font-bold">42</span>
        </div>
        <div className="flex items-center justify-between p-2.5 bg-background  border border-border/50">
          <span className="text-xs text-muted-foreground font-medium">Conversion</span>
          <span className="text-sm font-bold">3.2%</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[10px] font-bold uppercase tracking-tight text-primary hover:bg-primary/5  mt-1"
        >
          Full Analytics <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}
