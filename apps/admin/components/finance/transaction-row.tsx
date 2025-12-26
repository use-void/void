"use client"

import { cn } from "@repo/ui"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface TransactionRowProps {
  transaction: {
    id: string
    type: 'income' | 'payout'
    customer: string
    date: string
    amount: string
    status: string
  }
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ناجحة': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10'
      case 'قيد المعالجة': return 'bg-orange-500/10 text-orange-500 border-orange-500/10'
      case 'فاشلة': return 'bg-red-500/10 text-red-500 border-red-500/10'
      default: return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  return (
    <div 
      className="group flex items-center justify-between p-3 transition-all duration-200  hover:bg-secondary/40 border border-transparent hover:border-border/50"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 w-8 justify-center">
          <div className="w-1.5 h-1.5  bg-muted-foreground/20 group-hover:bg-primary/40 transition-colors shrink-0" />
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-11 w-11  flex items-center justify-center border  transition-all group-hover:scale-105",
            transaction.type === 'income' 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
              : "bg-zinc-500/10 border-border text-muted-foreground"
          )}>
            {transaction.type === 'income' ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownLeft className="h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-foreground text-sm">{transaction.customer}</h3>
            <span className="text-[10px] text-muted-foreground font-mono leading-none mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {transaction.id}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-[55%] text-right">
        <div className="flex-1">
          <span className="text-muted-foreground/80 text-xs font-medium">
            {transaction.date}
          </span>
        </div>
        
        <div className="flex-1 px-4">
          <span className={cn(
            "tabular-nums text-base font-black tracking-tight",
            transaction.type === 'income' ? "text-foreground" : "text-muted-foreground"
          )}>
            {transaction.type === 'payout' && "- "}
            {transaction.amount} <span className="text-[10px] font-medium text-muted-foreground ms-0.5">ر.س</span>
          </span>
        </div>

        <div className="w-24 flex justify-end">
          <span className={cn(
            "px-2 py-0.5 text-[10px] font-bold  border tabular-nums transition-all",
            getStatusColor(transaction.status)
          )}>
            {transaction.status}
          </span>
        </div>
      </div>
    </div>
  )
}
