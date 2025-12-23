"use client"

import * as React from "react"
import { TransactionRow } from "./transaction-row"

interface Transaction {
  id: string
  type: 'income' | 'payout'
  customer: string
  date: string
  amount: string
  status: string
}

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="relative pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">المعاملات الأخيرة</h2>
      </div>

      {/* Table Header */}
      <div className="flex items-center justify-between px-4 py-3 mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
        <div className="flex items-center gap-4 flex-1">
          <div className="ms-[3.5rem]">المعاملة</div>
        </div>

        <div className="flex items-center justify-between w-[60%] text-right">
          <div className="w-1/4">التاريخ</div>
          <div className="w-1/4">المبلغ</div>
          <div className="w-1/4 flex justify-end">الحالة</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="space-y-1">
        {transactions.map((transaction) => (
          <TransactionRow 
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>
    </div>
  )
}
