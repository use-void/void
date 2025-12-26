"use client";

import React from "react";
import { cn } from "@repo/ui";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  align = "right",
}: PageHeaderProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    right: "text-right items-end",
    center: "text-center items-center",
  };

  return (
    <div className={cn("w-full px-6 lg:px-10 py-8", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className={cn("flex flex-col gap-1.5", alignmentClasses[align], "md:text-start md:items-start flex-1")}>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {description}
            </p>
          )}
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
