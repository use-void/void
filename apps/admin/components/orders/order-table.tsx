"use client"

import * as React from "react"
import { OrderRow } from "./order-row"

interface Order {
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

interface OrderTableProps {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="relative pb-24">
      {/* Table Header */}
      <div className="flex items-center justify-between px-4 py-3 mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
        <div className="flex items-center gap-4 flex-1">
          <div className="ms-[3.5rem]">الطلب</div>
        </div>

        <div className="flex items-center justify-between w-[60%] text-right">
          <div className="w-1/4">التاريخ</div>
          <div className="w-1/4">الإجمالي</div>
          <div className="w-1/4">الدفع</div>
          <div className="w-1/4 flex justify-end">الحالة</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="space-y-1">
        {orders.map((order) => (
          <OrderRow 
            key={order.id}
            order={order}
          />
        ))}
      </div>
    </div>
  )
}
