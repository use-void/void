"use client"

import { cn } from "@repo/ui"
import { Link } from "@repo/i18n/navigation"
import Image from "next/image"

interface CustomerRowProps {
  customer: {
    id: string
    name: string
    email: string
    avatar?: string
    totalOrders: number
    totalSpent: string
    lastActive: string
    status: string
  }
}

export function CustomerRow({ customer }: CustomerRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'غير نشط': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
      default: return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  return (
    <div 
      className="group flex items-center justify-between p-4 mb-2 transition-all duration-200 border border-transparent hover:border-border hover:bg-secondary/30"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 min-w-[3.5rem]">
          <div className="w-1.5 h-1.5  bg-muted-foreground/30 shrink-0" />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="h-12 w-12  bg-secondary flex items-center justify-center overflow-hidden border border-border ">
            {customer.avatar ? (
               <div className="relative h-full w-full">
                <Image 
                    src={customer.avatar} 
                    alt={customer.name} 
                    fill 
                    className="object-cover"
                    unoptimized
                />
              </div>
            ) : (
              <div className="h-6 w-6 bg-muted-foreground/20 " />
            )}
          </div>
          <Link href={`/customers/${customer.id}`} className="text-right hover:opacity-80 transition-opacity">
            <h3 className="font-semibold text-foreground">{customer.name}</h3>
            <p className="text-xs text-muted-foreground lowercase">{customer.email}</p>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between w-[60%] text-right font-medium">
        <div className="w-1/4">
          <span className="text-foreground tabular-nums">
            {customer.totalOrders} <span className="text-[10px] text-muted-foreground ms-1">طلبات</span>
          </span>
        </div>
        
        <div className="w-1/4">
          <span className="text-foreground tabular-nums">
            {customer.totalSpent} <span className="text-[10px] text-muted-foreground ms-1">ر.س</span>
          </span>
        </div>

        <div className="w-1/5">
          <span className="text-muted-foreground text-sm">
            {customer.lastActive}
          </span>
        </div>

        <div className="w-1/4 flex justify-end">
          <span className={cn(
            "px-2.5 py-1 text-[11px] font-bold  border",
            getStatusColor(customer.status)
          )}>
            {customer.status}
          </span>
        </div>
      </div>
    </div>
  )
}
