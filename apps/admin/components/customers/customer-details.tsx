"use client";

import React from "react";
import { useTranslations } from "@repo/i18n";
import { DetailHeader } from "@/components/layout/headers/header-detail";
import { Button } from "@repo/ui";
import { Edit, Ban, Mail } from "lucide-react";

export function CustomerDetails({ customerId }: { customerId: string }) {
  const t = useTranslations("Admin.customers");

  return (
    <div className="flex flex-col w-full min-h-screen">
      <DetailHeader 
        title="John Doe"
        id={customerId}
        backHref="/customers"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
               <Mail className="w-4 h-4" />
               Email
            </Button>
             <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10">
               <Ban className="w-4 h-4" />
               Block
            </Button>
            <Button size="sm" className="gap-2">
               <Edit className="w-4 h-4" />
               Edit
            </Button>
          </div>
        }
      />

      <div className="w-full px-6 lg:px-10 py-8">
         {/* Details Page Skeleton Content */}
         <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
                <div className="border-2 border-dashed border-border/20 rounded-xl h-48 flex items-center justify-center text-muted-foreground">
                    Customer Overview
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-96 flex items-center justify-center text-muted-foreground">
                    Order History
                </div>
            </div>
            <div className="space-y-8">
                <div className="border-2 border-dashed border-border/20 rounded-xl h-80 flex items-center justify-center text-muted-foreground">
                    Contact Info
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-40 flex items-center justify-center text-muted-foreground">
                    Notes
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export function CustomerDetailsSkeleton() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
