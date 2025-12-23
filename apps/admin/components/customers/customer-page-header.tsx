"use client"

import { UserPlus, FileDown } from "lucide-react"
import { Button } from "@repo/ui"

interface CustomerPageHeaderProps {
  title: string
  description: string
}

export function CustomerPageHeader({ title, description }: CustomerPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-8">
      <div className="space-y-1 text-right">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 rounded-xl">
          <FileDown className="h-4 w-4" />
          <span>تصدير</span>
        </Button>
        <Button className="h-11 px-5 bg-foreground hover:bg-foreground/90 text-background font-semibold gap-2 rounded-xl">
          <UserPlus className="h-5 w-5" />
          <span>إضافة عميل</span>
        </Button>
      </div>
    </div>
  )
}
