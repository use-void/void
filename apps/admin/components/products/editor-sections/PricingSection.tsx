"use client"

import { Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Input } from "@repo/ui"
import { useTranslations } from "next-intl"

interface PricingSectionProps {
  price: string;
  compareAtPrice: string;
  cost: string;
  onPricingChange: (field: string, value: string) => void;
}

export function PricingSection({
  price,
  compareAtPrice,
  cost,
  onPricingChange,
}: PricingSectionProps) {
  const t = useTranslations("Admin.products")

  // Calculations
  const priceNum = parseFloat(price.replace(/,/g, '')) || 0
  const costNum = parseFloat(cost.replace(/,/g, '')) || 0
  const profit = priceNum - costNum
  const margin = priceNum > 0 ? (profit / priceNum) * 100 : 0

  return (
    <Card className=" border-border overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">Pricing Intelligence</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("table.price")}
            </label>
            <div className="relative">
              <Input
                value={price}
                onChange={(e) => onPricingChange("price", e.target.value)}
                placeholder="0.00"
                className="h-10  bg-secondary/20 border-border ps-12 font-bold text-base"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                {t("currency")}
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider opacity-60">
              Price Before Discount
            </label>
            <div className="relative">
              <Input
                value={compareAtPrice}
                onChange={(e) => onPricingChange("compareAtPrice", e.target.value)}
                placeholder="0.00"
                className="h-10  bg-secondary/20 border-border ps-12 text-muted-foreground line-through decoration-muted-foreground/50 text-base"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                {t("currency")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-end border-t border-border pt-6 mt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cost Per Item
            </label>
            <div className="relative">
              <Input
                value={cost}
                onChange={(e) => onPricingChange("cost", e.target.value)}
                placeholder="0.00"
                className="h-10  bg-secondary/20 border-border ps-12 text-base"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                {t("currency")}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground px-1 uppercase tracking-tight">
              Customers won&apos;t see this.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-muted/50 border border-border  p-3 h-10 mb-5">
            <div className="flex-1">
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Margin</p>
              <p className="font-bold text-sm leading-none">{margin.toFixed(1)}%</p>
            </div>
            <div className="w-[1px] h-full bg-border" />
            <div className="flex-1 text-right">
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Profit</p>
              <p className="font-bold text-sm leading-none">
                {profit.toLocaleString()} {t("currency")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
