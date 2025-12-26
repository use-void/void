"use client";

import React from "react";
import { useTranslations } from "@repo/i18n";
import { DetailHeader } from "@/components/layout/headers/header-detail";
import { Button } from "@repo/ui";
import { Download, ExternalLink, Ban } from "lucide-react";

export function TransactionDetails({ transactionId }: { transactionId: string }) {
  // const t = useTranslations("Admin.finance.transactions"); // mock for now

  return (
    <div className="flex flex-col w-full min-h-screen">
      <DetailHeader 
        title="Transaction Details"
        id={transactionId}
        backHref="/finance/transactions"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
               <Download className="w-4 h-4" />
               Download Receipt
            </Button>
             <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:bg-destructive/10">
               <Ban className="w-4 h-4" />
               Dispute
            </Button>
          </div>
        }
      />

      <div className="w-full px-6 lg:px-10 py-8">
         {/* Details Page Skeleton Content */}
         <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
                <div className="border-2 border-dashed border-border/20 rounded-xl h-48 flex items-center justify-center text-muted-foreground">
                    Payment Overview
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-40 flex items-center justify-center text-muted-foreground">
                    Metadata / JSON
                </div>
            </div>
            <div className="space-y-8">
                <div className="border-2 border-dashed border-border/20 rounded-xl h-80 flex items-center justify-center text-muted-foreground">
                    Payer Info
                </div>
                <div className="border-2 border-dashed border-border/20 rounded-xl h-40 flex items-center justify-center text-muted-foreground">
                    Security Check
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
