"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { 
  Button,
  ScrollArea,
  SheetClose,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Checkbox,
  cn
} from "@repo/ui"
import { RotateCcw, Check, Filter } from "lucide-react"

export interface FilterState {
  status: string[]
  categories: string[]
  brands: string[]
  colors: string[]
  priceRanges: string[]
}

interface ProductFiltersProps {
  initialFilters: FilterState
  onApply: (filters: FilterState) => void
  onReset: () => void
}

const STATUSES = [
  { id: "active", key: "active" },
  { id: "archived", key: "archived" },
  { id: "draft", key: "draft" }
]

const CATEGORIES = [
  "إلكترونيات",
  "ملحقات كمبيوتر",
  "أجهزة قابلة للارتداء",
  "تصوير"
]

const BRANDS = [
  { id: "apple", key: "apple" },
  { id: "samsung", key: "samsung" },
  { id: "sony", key: "sony" },
  { id: "logitech", key: "logitech" }
]

const COLORS = [
  { id: "black", key: "black", hex: "#000000" },
  { id: "white", key: "white", hex: "#ffffff" },
  { id: "silver", key: "silver", hex: "#E5E7EB" },
  { id: "blue", key: "blue", hex: "#3B82F6" }
]

const PRICE_RANGES = [
  { id: "under_100", key: "under_100" },
  { id: "100_500", key: "100_500" },
  { id: "500_1000", key: "500_1000" },
  { id: "over_1000", key: "over_1000" }
]

export function ProductFilters({ initialFilters, onApply, onReset }: ProductFiltersProps) {
  const t = useTranslations("Admin.products")
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const [localFilters, setLocalFilters] = React.useState<FilterState>(initialFilters)

  React.useEffect(() => {
    setLocalFilters(initialFilters)
  }, [initialFilters])

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  const handleReset = () => {
    const freshFilters: FilterState = { 
        status: [], 
        categories: [],
        brands: [],
        colors: [],
        priceRanges: []
    }
    setLocalFilters(freshFilters)
    onReset()
  }

  const renderSection = (
    titleKey: string, 
    filterKey: keyof FilterState, 
    items: { id: string | number, label?: string, key?: string }[]
  ) => {
    return (
      <AccordionItem value={filterKey} className="border-b-0 mb-2">
        <AccordionTrigger className="hover:no-underline px-4 py-3 rounded-xl hover:bg-secondary/20 transition-colors border border-transparent aria-expanded:border-border/50 text-start">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-secondary/80 text-foreground/70">
              <Filter className="size-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">{t(`table.${titleKey}`)}</span>
            {localFilters[filterKey].length > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                {localFilters[filterKey].length}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-1 pb-4">
          <div className="grid gap-1 mt-2">
            {items.map((item) => (
              <label 
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40 cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={localFilters[filterKey].includes(String(item.id))}
                    onCheckedChange={() => toggleFilter(filterKey, String(item.id))}
                    className="size-4.5"
                  />
                  <span className="text-[14px] font-medium group-hover:text-foreground transition-colors">
                      {item.label || t(`${filterKey}.${item.key}`)}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  const renderColors = () => (
    <AccordionItem value="colors" className="border-b-0 mb-2">
      <AccordionTrigger className="hover:no-underline px-4 py-3 rounded-xl hover:bg-secondary/20 transition-colors border border-transparent aria-expanded:border-border/50 text-start">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-secondary/80 text-foreground/70">
            <Filter className="size-3.5" />
          </div>
          <span className="text-sm font-bold tracking-tight">{t("table.color")}</span>
          {localFilters.colors.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
              {localFilters.colors.length}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-3 pb-4">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
             const isSelected = localFilters.colors.includes(color.id)
             return (
              <div 
                key={color.id}
                onClick={() => toggleFilter("colors", color.id)}
                className={cn(
                  "relative group cursor-pointer p-0.5 rounded-full transition-all duration-200 border-2",
                  isSelected ? "border-primary" : "border-transparent hover:border-muted-foreground/20"
                )}
              >
                <div 
                  className="size-8 rounded-full shadow-sm border border-border/20" 
                  style={{ backgroundColor: color.hex }} 
                />
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className={cn(
                      "size-4 stroke-[3]", 
                      color.id === 'white' || color.id === 'silver' ? "text-black" : "text-white"
                    )} />
                  </div>
                )}
                <span className="sr-only">{t(`colors.${color.key}`)}</span>
              </div>
            )
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  )

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="flex flex-col h-full overflow-hidden bg-background">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion defaultValue={["status", "category"]} className="w-full">
            
            {renderSection("status", "status", STATUSES)}
            
            <AccordionItem value="categories" className="border-b-0 mb-2">
              <AccordionTrigger className="hover:no-underline px-4 py-3 rounded-xl hover:bg-secondary/20 transition-colors border border-transparent aria-expanded:border-border/50 text-start">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-secondary/80 text-foreground/70">
                    <Filter className="size-3.5" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{t("table.category")}</span>
                  {localFilters.categories.length > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                      {localFilters.categories.length}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-1 pb-4">
                <div className="grid gap-1 mt-2">
                  {CATEGORIES.map((category) => (
                    <label 
                      key={category}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={localFilters.categories.includes(category)}
                          onCheckedChange={() => toggleFilter("categories", category)}
                          className="size-4.5"
                        />
                        <span className="text-[14px] font-medium group-hover:text-foreground transition-colors">
                            {category}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {renderSection("brand", "brands", BRANDS)}
            {renderSection("color", "colors", COLORS)}
            {renderSection("price_range", "priceRanges", PRICE_RANGES)}

          </Accordion>
        </div>
      </ScrollArea>

      <div className="p-6 bg-muted/20 border-t border-border mt-auto backdrop-blur-md">
        <div className="flex flex-col gap-3">
          <SheetClose render={
            <Button 
              onClick={() => onApply(localFilters)}
              className="w-full h-13 bg-foreground hover:bg-foreground/90 text-background font-bold text-base transition-all active:scale-[0.98] shadow-sm"
            >
              <Check className="me-2 h-5 w-5 stroke-[2.5]" />
              {t("settings.actions.save_changes")}
            </Button>
          } />
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="w-full h-11 bg-transparent border-border/60 hover:bg-secondary/50 transition-all font-semibold text-muted-foreground hover:text-foreground active:scale-[0.98]"
          >
            <RotateCcw className="me-2 h-4 w-4 opacity-70 rtl:-scale-x-100" />
            {t("reset")}
          </Button>
        </div>
      </div>
    </div>
  )
}
