"use client"

import * as React from "react"
import { CustomerRow } from "./customer-row"

interface Customer {
  id: string
  name: string
  email: string
  avatar?: string
  totalOrders: number
  totalSpent: string
  lastActive: string
  status: string
}

interface CustomerTableProps {
  customers: Customer[]
}

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <div className="relative pb-24">
      {/* Table Header */}
      <div className="flex items-center justify-between px-4 py-3 mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
        <div className="flex items-center gap-4 flex-1">
          <div className="ms-[3.5rem]">العميل</div>
        </div>

        <div className="flex items-center justify-between w-[60%] text-right">
          <div className="w-1/4">إجمالي الطلبات</div>
          <div className="w-1/4">إجمالي الإنفاق</div>
          <div className="w-1/5">آخر نشاط</div>
          <div className="w-1/4 flex justify-end">الحالة</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="space-y-1">
        {customers.map((customer) => (
          <CustomerRow 
            key={customer.id}
            customer={customer}
          />
        ))}
      </div>
    </div>
  )
}
