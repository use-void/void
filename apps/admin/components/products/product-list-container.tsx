"use client"

import { Plus, Filter, ChevronRight } from "lucide-react"
import { 
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn
} from "@repo/ui"
import { Link } from "@repo/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { PRODUCT_TYPES } from "@/types/product"
import { PageHeader } from "@/components/layout/headers/header-page"
import { ProductTable } from "./product-table"
import { ProductFilters, type FilterState } from "./product-filters"
import React from "react"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stock: number
  status: string
  image?: string
}

interface ProductListContainerProps {
  initialProducts: Product[]
}

export function ProductListContainer({ initialProducts }: ProductListContainerProps) {
  const t = useTranslations("Admin.products")
  const locale = useLocale()
  const isRtl = locale === 'ar'

  const [filters, setFilters] = React.useState<FilterState>({ 
    status: [], 
    categories: [],
    brands: [],
    colors: [],
    priceRanges: [] 
  })
  
  /* Removed useMemo as requested */
  const filteredProducts = initialProducts.filter(product => {
    const statusMatch = filters.status.length === 0 || filters.status.some(s => {
        if (s === "active") return product.status === "نشط" || product.status === "Active"
        if (s === "archived") return product.status === "مؤرشف" || product.status === "Archived"
        if (s === "draft") return product.status === "مسودة" || product.status === "Draft"
        return false
    })
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.category)
    return statusMatch && categoryMatch
  })

  const handleResetFilters = () => setFilters({ 
    status: [], 
    categories: [],
    brands: [], 
    colors: [], 
    priceRanges: [] 
  })

  return (
    <div className="flex flex-col w-full min-h-screen pb-20">
      <PageHeader 
        title={t("title")} 
        description={t("description")}
        align={isRtl ? "right" : "left"}
        actions={
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger 
                render={
                  <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
                    <Filter className="h-4 w-4" />
                    <span>{t("filter")}</span>
                  </Button>
                }
              />
              <SheetContent side={isRtl ? "left" : "right"} className={cn(
                "p-0 border-border bg-background",
                isRtl ? "border-r" : "border-l"
              )}>
                <SheetHeader className="p-6 pb-2 border-b border-border/50 text-start">
                  <SheetTitle className="text-xl font-semibold tracking-tight">{t("filter")}</SheetTitle>
                </SheetHeader>
                <ProductFilters 
                  initialFilters={filters}
                  onApply={setFilters}
                  onReset={handleResetFilters}
                />
              </SheetContent>
            </Sheet>

            <Dialog>
              <DialogTrigger 
                render={
                  <Button className="h-11 px-5 bg-foreground hover:bg-foreground/90 text-background font-semibold gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="h-5 w-5" />
                    <span>{t("add")}</span>
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border bg-background">
                <DialogHeader className="p-6 pb-2 text-start">
                  <DialogTitle className="text-xl font-semibold tracking-tight">{t("add")}</DialogTitle>
                  <DialogDescription className="text-sm">
                    Choose a product type to continue.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col gap-0.5 p-3">
                  {Object.values(PRODUCT_TYPES).map((type) => (
                    <Link 
                      key={type.id} 
                      href={`/products/add?type=${type.id}`}
                      className="group"
                    >
                      <div className="flex items-center gap-4 p-4  hover:bg-secondary/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/50">
                        <div className={cn(
                          "flex items-center justify-center transition-colors",
                          type.color || "text-foreground"
                        )}>
                          <type.icon className="h-5 w-5 stroke-[1.5]" />
                        </div>
                        
                        <div className="flex-1 space-y-0.5">
                          <h4 className="font-medium text-[15px] group-hover:text-primary transition-colors">
                            {type.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {type.description}
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all rtl:rotate-180" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="p-4 bg-muted/30 border-t border-border/50">
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider font-semibold">
                    Quick Selection
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="w-full px-6 lg:px-10 py-8">
        <ProductTable products={filteredProducts} />
      </div>
    </div>
  )
}
