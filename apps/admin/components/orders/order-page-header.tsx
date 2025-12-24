"use client"

import { FileDown, Filter } from "lucide-react"
import { Button } from "@repo/ui"

interface OrderPageHeaderProps {
  title: string
  description: string
}

export function OrderPageHeader({ title, description }: OrderPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-8">
      <div className="space-y-1 text-right">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
          <Filter className="h-4 w-4" />
          <span>تصفية</span>
        </Button>
        <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
          <FileDown className="h-4 w-4" />
          <span>تصدير</span>
        </Button>
      </div>
    </div>
  )
}
