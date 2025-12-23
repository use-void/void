"use client"

import { Checkbox } from "@repo/ui"
import { cn } from "@repo/ui"
import { useTranslations } from "next-intl"
import Image from "next/image"

interface ProductRowProps {
  product: {
    id: string
    name: string
    sku: string
    category: string
    price: string
    stock: number
    status: string
    image?: string
  }
  isSelected: boolean
  isSelectionActive: boolean
  onToggle: (id: string) => void
}

export function ProductRow({ product, isSelected, isSelectionActive, onToggle }: ProductRowProps) {
  const t = useTranslations("Products")

  const getStatusColor = (status: string) => {
    // We map normalized keys or Arabic keys to colors
    switch (status) {
      case 'نشط': 
      case 'Active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'مؤرشف': 
      case 'Archived': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'مسودة': 
      case 'Draft': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    }
  }

  const getTranslatedStatus = (status: string) => {
    switch (status) {
        case 'نشط': return t('status.active')
        case 'مؤرشف': return t('status.archived')
        case 'مسودة': return t('status.draft')
        default: return status
    }
  }

  return (
    <div 
      className={cn(
        "group flex items-center justify-between p-4 mb-2 transition-all duration-200 rounded-2xl border border-transparent hover:border-border hover:bg-secondary/30",
        isSelected && "bg-secondary/50 border-border shadow-sm"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 min-w-[3.5rem]">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
          
          {isSelectionActive && (
            <div className="flex items-center justify-center w-5 h-5 cursor-pointer animate-in fade-in zoom-in duration-200" onClick={() => onToggle(product.id)}>
              <Checkbox 
                checked={isSelected} 
                onCheckedChange={() => onToggle(product.id)}
                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:text-background"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border border-border shadow-sm">
            {product.image ? (
              <div className="relative h-full w-full">
                <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                    unoptimized
                />
              </div>
            ) : (
              <div className="h-6 w-6 bg-muted-foreground/20 rounded-md" />
            )}
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground font-mono tracking-tighter uppercase">{product.sku}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-[60%] text-right font-medium">
        <div className="w-1/4">
          <span className="text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg border border-border/50 text-sm">
            {product.category}
          </span>
        </div>
        
        <div className="w-1/4">
          <span className="text-foreground tabular-nums">
            {product.price} <span className="text-[10px] text-muted-foreground ms-1">{t('currency')}</span>
          </span>
        </div>

        <div className="w-1/4">
          <span className={cn(
            "tabular-nums",
            product.stock === 0 ? "text-destructive" : "text-foreground"
          )}>
            {product.stock}
          </span>
        </div>

        <div className="w-1/4 flex justify-end">
          <span className={cn(
            "px-2.5 py-1 text-[11px] font-bold rounded-lg border",
            getStatusColor(product.status)
          )}>
            {getTranslatedStatus(product.status)}
          </span>
        </div>
      </div>
    </div>
  )
}
