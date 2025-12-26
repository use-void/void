"use client"

import { Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui"
import { useTranslations } from "next-intl"

interface StatusSectionProps {
  status: string;
  onStatusChange: (value: string | null) => void;
}

export function StatusSection({ status, onStatusChange }: StatusSectionProps) {
  const t = useTranslations("Admin.products")

  return (
    <Card className=" border-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("details.status")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 w-full bg-secondary/20 border-border  px-3 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className=" border-border bg-card">
            <SelectItem
              value="active"
              className=" focus:bg-emerald-500/10 text-emerald-600 font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5  bg-emerald-500" />
                <span>{t("status.active")}</span>
              </div>
            </SelectItem>
            <SelectItem
              value="draft"
              className=" focus:bg-zinc-500/10 text-zinc-600 font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5  bg-zinc-500" />
                <span>{t("status.draft")}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground mt-2 px-1 leading-tight uppercase tracking-tight">
          Setting this to active will make the product visible in your store immediately.
        </p>
      </CardContent>
    </Card>
  )
}
