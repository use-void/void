"use client"

import { Link } from "@repo/i18n/navigation"

interface OrderRowProps {
  order: {
    id: string
    customer: {
      name: string
      email: string
      avatar?: string
    }
    date: string
    total: string
    status: string
    paymentStatus: string
  }
}

import Image from "next/image"
import { cn } from "@repo/ui"

export function OrderRow({ order }: OrderRowProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'قيد المعالجة': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'قيد الانتظار': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'ملغي': return 'bg-red-500/10 text-red-500 border-red-500/20'
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
        
        <Link href={`/orders/${order.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="h-12 w-12  bg-secondary flex items-center justify-center overflow-hidden border border-border  relative">
            {order.customer.avatar ? (
              <Image src={order.customer.avatar} alt={order.customer.name} fill className="object-cover" />
            ) : (
              <div className="h-6 w-6 bg-muted-foreground/20 " />
            )}
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-foreground">{order.customer.name}</h3>
            <p className="text-xs text-muted-foreground font-mono tracking-tighter uppercase">#{order.id}</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-between w-[60%] text-right font-medium">
        <div className="w-1/4">
          <span className="text-muted-foreground text-sm">
            {order.date}
          </span>
        </div>
        
        <div className="w-1/4">
          <span className="text-foreground tabular-nums">
            {order.total} <span className="text-[10px] text-muted-foreground ms-1">ر.س</span>
          </span>
        </div>

        <div className="w-1/4">
          <span className={cn(
            "px-2.5 py-1 text-[11px] font-bold  border",
            order.paymentStatus === 'مدفوع' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
          )}>
            {order.paymentStatus}
          </span>
        </div>

        <div className="w-1/4 flex justify-end">
          <span className={cn(
            "px-2.5 py-1 text-[11px] font-bold  border",
            getStatusColor(order.status)
          )}>
            {order.status}
          </span>
        </div>
      </div>
    </div>
  )
}
