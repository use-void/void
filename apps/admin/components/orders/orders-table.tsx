"use client";

import { Button } from "@repo/ui";
import { MoreHorizontal, Eye } from "lucide-react";
import { Link } from "@repo/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  cn // Assuming cn is exported from ui, or import from utility
} from "@repo/ui";
import type { Order } from "@/lib/mock-data";

export function OrdersTable({ data }: { data: Order[] }) {

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-border rounded-xl bg-card">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-accent border-b border-border">
          <tr>
            <th className="px-6 py-4 font-medium tracking-wider">Order</th>
            <th className="px-6 py-4 font-medium tracking-wider">Customer</th>
            <th className="px-6 py-4 font-medium tracking-wider">Status</th>
            <th className="px-6 py-4 font-medium tracking-wider">Payment</th>
            <th className="px-6 py-4 font-medium tracking-wider">Date</th>
            <th className="px-6 py-4 font-medium tracking-wider">Total</th>
            <th className="px-6 py-4 font-medium tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((order) => (
            <tr
              key={order.id}
              className="group hover:bg-muted/30 transition-colors duration-200"
            >
              <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                #{order.id}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  {/* هنا التعديل المهم: الوصول للكائن المتداخل بدلاً من النص المباشر */}
                  <span className="font-medium text-foreground">
                    {order.customer?.name || "Unknown"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.customer?.email}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.paymentStatus} />
              </td>
              <td className="px-6 py-4 text-muted-foreground text-xs">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 font-medium text-foreground">
                ${order.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-right">
                <DropdownMenu>
                  {/* رجعنا للكود الصحيح الخاص بك الذي يستخدم render prop */}
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  ></DropdownMenuTrigger>
                  
                  <DropdownMenuContent
                    align="end"
                    className="bg-popover border-border text-muted-foreground"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link
                        href={`/orders/${order.id}`}
                        className="block w-full"
                      >
                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    unpaid: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    refunded: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  const currentStyle =
    styles[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
        currentStyle
      )}
    >
      {status}
    </span>
  );
}