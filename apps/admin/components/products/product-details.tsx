"use client";

import React from "react";
import { useTranslations } from "@repo/i18n";
import { DetailHeader } from "@/components/layout/headers/header-detail";
import { Button } from "@repo/ui";
import { Edit, MoreHorizontal } from "lucide-react";

export function ProductDetails({ productId }: { productId: string }) {
  const t = useTranslations("Admin.products");

  return (
    <div className="flex flex-col w-full min-h-screen">
      <DetailHeader 
        title="Gaming Monitor 4K"
        id={productId}
        backHref="/products"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
               <Edit className="w-4 h-4" />
               Edit Product
            </Button>
            <Button variant="ghost" size="icon">
               <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        }
      />

      <div className="w-full px-6 lg:px-10 py-8">
         {/* Details Page Skeleton Content */}
         <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
                <div className="border-2 border-dashed border-border/20 rounded-xl h-64 flex items-center justify-center text-muted-foreground">
                    Product Info Chart
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-96 flex items-center justify-center text-muted-foreground">
                    Sales History
                </div>
            </div>
            <div className="space-y-8">
                <div className="border-2 border-dashed border-border/20 rounded-xl h-40 flex items-center justify-center text-muted-foreground">
                    Status Card
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-80 flex items-center justify-center text-muted-foreground">
                    Activity Log
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
