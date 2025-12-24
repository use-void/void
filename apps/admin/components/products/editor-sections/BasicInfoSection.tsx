"use client"

import { Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@repo/ui"
import { useTranslations } from "next-intl"

interface BasicInfoSectionProps {
  activeLocale: string;
  flag: string;
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoSection({
  flag,
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: Omit<BasicInfoSectionProps, 'activeLocale'>) {
  const t = useTranslations("Admin.products")

  return (
    <Card className=" border-border overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">
            {t("details.basicInfo")} ({flag})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("table.product")}
          </label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="اسم المنتج المميز..."
            className="h-10  bg-secondary/20 border-border focus-visible:ring-1 px-3 text-base"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("setup.steps.store.description")}
          </label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="اكتب تفاصيل جذابة عن منتجك هنا..."
            className="min-h-[120px]  bg-secondary/20 border-border focus-visible:ring-1 p-3 resize-none text-base"
          />
        </div>
      </CardContent>
    </Card>
  )
}
