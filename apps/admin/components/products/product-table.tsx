"use client"

import * as React from "react"
import { ListChecks, MinusSquare, CheckSquare, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@repo/ui"
import { ProductRow } from "./product-row"
import { BulkActionsBar } from "./bulk-actions-bar"

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

interface ProductTableProps {
  products: Product[]
}

export function ProductTable({ products }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isSelectionActive, setIsSelectionActive] = React.useState(false)

  const toggleAll = () => {
    if (!isSelectionActive) {
      setIsSelectionActive(true)
      return
    }

    if (selectedIds.length === products.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(products.map(p => p.id))
    }
  }

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    )
  }

  const handleCancelSelection = () => {
    setSelectedIds([])
    setIsSelectionActive(false)
  }

  const isAllSelected = products.length > 0 && selectedIds.length === products.length
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < products.length
  const t = useTranslations("Products")

  return (
    <div className="relative pb-24">
      {/* Table Header */}
      <div className="flex items-center justify-between px-4 py-3 mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center bg-secondary/50 border border-border rounded-xl overflow-hidden h-9 shadow-sm">
            <div 
              className={cn(
                "flex items-center justify-center w-10 h-full cursor-pointer transition-all duration-200",
                (isAllSelected || isSomeSelected)
                  ? "bg-foreground text-background" 
                  : "text-muted-foreground hover:text-foreground"
              )} 
              onClick={toggleAll}
            >
              {isAllSelected ? (
                <CheckSquare className="h-4.5 w-4.5" />
              ) : isSomeSelected ? (
                <MinusSquare className="h-4.5 w-4.5" />
              ) : (
                <ListChecks className="h-4.5 w-4.5" />
              )}
            </div>

            {isSelectionActive && (
              <>
                <div className="w-[1px] h-4 bg-border" />
                <button 
                  onClick={handleCancelSelection}
                  className="flex items-center justify-center w-9 h-full text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <span className="text-muted-foreground ms-2 font-semibold">{t("table.product")}</span>
        </div>

        <div className="flex items-center justify-between w-[60%] text-right">
          <div className="w-1/4">{t("table.category")}</div>
          <div className="w-1/4">{t("table.price")}</div>
          <div className="w-1/4">{t("table.stock")}</div>
          <div className="w-1/4 flex justify-end">{t("table.status")}</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="space-y-1">
        {products.map((product) => (
          <ProductRow 
            key={product.id}
            product={product}
            isSelected={selectedIds.includes(product.id)}
            isSelectionActive={isSelectionActive}
            onToggle={toggleOne}
          />
        ))}
      </div>

      {/* Floating Bulk Actions */}
      <BulkActionsBar 
        selectedCount={selectedIds.length} 
        onClear={() => setSelectedIds([])} 
      />
    </div>
  )
}
