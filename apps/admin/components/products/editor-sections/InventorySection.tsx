"use client"

import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Input, Switch } from "@repo/ui"
import { useTranslations } from "next-intl"

interface InventorySectionProps {
  sku: string;
  barcode: string;
  stock: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  onInventoryChange: (field: string, value: string | number | boolean) => void;
}

export function InventorySection({
  sku,
  barcode,
  stock,
  trackQuantity,
  allowBackorder,
  onInventoryChange,
}: InventorySectionProps) {
  const t = useTranslations("Admin.products")

  return (
    <Card className=" border-border overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">Inventory Logic</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("details.sku")}
            </label>
            <Input
              value={sku}
              onChange={(e) => onInventoryChange("sku", e.target.value)}
              placeholder="e.g. PRD-123456"
              className="h-10  bg-secondary/20 border-border px-3 font-mono uppercase text-base"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Barcode (ISBN/UPC)
            </label>
            <Input
              value={barcode}
              onChange={(e) => onInventoryChange("barcode", e.target.value)}
              placeholder="000123456789"
              className="h-10  bg-secondary/20 border-border px-3 text-base"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-sm">{t("details.stock")}</h4>
              <p className="text-xs text-muted-foreground">Manage physical items in stock.</p>
            </div>
            <Input
              type="number"
              value={stock}
              onChange={(e) => onInventoryChange("stock", parseInt(e.target.value) || 0)}
              className="h-10 w-24  bg-secondary/20 border-border text-center font-bold text-base px-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-secondary/20 border border-border ">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Track Quantity
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                  Auto-decrease stock.
                </p>
              </div>
              <Switch
                checked={trackQuantity}
                onCheckedChange={(checked) => onInventoryChange("trackQuantity", checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/20 border border-border ">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Allow Backorders
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                  Sell past zero stock.
                </p>
              </div>
              <Switch
                checked={allowBackorder}
                onCheckedChange={(checked) => onInventoryChange("allowBackorder", checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
