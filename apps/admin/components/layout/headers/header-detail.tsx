"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, cn } from "@repo/ui";
import { useLocale } from "next-intl";

interface DetailHeaderProps {
  title: string;
  id?: string | number;
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DetailHeader({
  title,
  id,
  backHref,
  actions,
  className,
}: DetailHeaderProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;

  return (
    <div 
      className={cn(
        "sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/50 h-20 mb-6",
        className
      )}
    >
      <div className="w-full px-6 lg:px-10 h-full flex items-center justify-between">
        <div className="flex items-center gap-6 h-full min-w-0">
          {backHref && (
            <div 
              className="flex items-center justify-center p-1 rounded-full hover:bg-muted transition-colors cursor-pointer" 
              onClick={() => router.push(backHref)}
            >
             <BackIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </div>
          )}
          
          <div className="flex items-center gap-3 overflow-hidden">
            <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
              {title}
            </h1>
            {id && (
              <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-mono font-medium">
                #{id}
              </span>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
