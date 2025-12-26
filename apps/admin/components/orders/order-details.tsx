"use client";

import React from "react";
import { useTranslations } from "@repo/i18n";
import { DetailHeader } from "@/components/layout/headers/header-detail";
import { Button } from "@repo/ui";
import { Printer, Download, Truck } from "lucide-react";

export function OrderDetails({ orderId }: { orderId: string }) {
  const t = useTranslations("Admin.orders");

  return (
    <div className="flex flex-col w-full min-h-screen">
      <DetailHeader 
        title="Order Details"
        id={orderId}
        backHref="/orders"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
               <Printer className="w-4 h-4" />
               Print
            </Button>
             <Button variant="outline" size="sm" className="gap-2">
               <Download className="w-4 h-4" />
               Invoice
            </Button>
            <Button size="sm" className="gap-2">
               <Truck className="w-4 h-4" />
               Ship Order
            </Button>
          </div>
        }
      />

      <div className="w-full px-6 lg:px-10 py-8">
         {/* Details Page Skeleton Content */}
         <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
                <div className="border-2 border-dashed border-border/20 rounded-xl h-32 flex items-center justify-center text-muted-foreground">
                    Order Items
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-64 flex items-center justify-center text-muted-foreground">
                    Fulfillment Status
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-48 flex items-center justify-center text-muted-foreground">
                    Payment Info
                </div>
            </div>
            <div className="space-y-8">
                <div className="border-2 border-dashed border-border/20 rounded-xl h-48 flex items-center justify-center text-muted-foreground">
                    Customer Info
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-48 flex items-center justify-center text-muted-foreground">
                    Shipping Address
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-64 flex items-center justify-center text-muted-foreground">
                    Timeline
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
