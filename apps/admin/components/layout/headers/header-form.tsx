"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@repo/ui";
import { useLocale } from "next-intl";

interface FormHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  // purely visual states or slots
  primaryAction?: React.ReactNode; 
  secondaryAction?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function FormHeader({
  title,
  description,
  backHref,
  primaryAction,
  secondaryAction,
  actions,
  className,
}: FormHeaderProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;

  return (
    <div 
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50 h-20 transition-all duration-200",
        className
      )}
    >
      <div className="w-full px-6 lg:px-10 h-full flex items-center justify-between">
        <div className="flex items-center gap-6 h-full min-w-0">
          <div className="flex items-center gap-5 overflow-hidden">
            {backHref && (
              <div className="flex items-center justify-center p-1 rounded-full hover:bg-muted transition-colors cursor-pointer" onClick={() => router.push(backHref)}>
               <BackIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </div>
            )}
            
            <div className="flex flex-col justify-center gap-0.5 overflow-hidden">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
                {title}
              </h1>
              {description && (
                <p className="text-xs font-medium text-muted-foreground truncate hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10 shrink-0">
          {actions && (
            <div className="flex items-center gap-10">
              <div className="flex items-center">
                {actions}
              </div>
              <div className="h-8 w-px bg-border/40" />
            </div>
          )}
          
          <div className="flex items-center gap-3">
             {secondaryAction}
             {primaryAction}
          </div>
        </div>
      </div>
    </div>
  );
}
