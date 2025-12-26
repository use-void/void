"use client"

import { Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui"

interface ShippingSectionProps {
  weight: string;
  unit: string;
  onShippingChange: (field: string, value: string) => void;
}

export function ShippingSection({
  weight,
  unit,
  onShippingChange,
}: ShippingSectionProps) {
  return (
    <Card className=" border-border overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">Shipping & Logistics</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Weight
            </label>
            <div className="flex gap-2">
              <Input
                value={weight}
                onChange={(e) => onShippingChange("weight", e.target.value)}
                placeholder="0.0"
                className="h-10  bg-secondary/20 border-border px-3 flex-1 text-base"
              />
              <Select
                value={unit}
                onValueChange={(v) => {
                  if (v) onShippingChange("unit", v);
                }}
              >
                <SelectTrigger className="w-20 h-10 bg-secondary/50 border-border  text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" border-border bg-card">
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
