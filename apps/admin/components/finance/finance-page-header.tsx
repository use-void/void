"use client"

import { FileDown, Filter, ArrowLeft } from "lucide-react"
import { Button } from "@repo/ui"
import Link from "next/link"
import { useParams } from "next/navigation"

interface FinancePageHeaderProps {
  title: string
  description: string
}

export function FinancePageHeader({ title, description }: FinancePageHeaderProps) {
  const { locale } = useParams()
  
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-8">
      <div className="space-y-1 text-right">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Link href={`/${locale}/finance/transactions`}>
          <Button variant="ghost" className="h-11 px-5 text-muted-foreground hover:text-foreground gap-2 rounded-xl">
            <span>عرض جميع المعاملات</span>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        
        <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 rounded-xl">
          <Filter className="h-4 w-4" />
          <span>تصفية</span>
        </Button>
        
        <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 rounded-xl">
          <FileDown className="h-4 w-4" />
          <span>تصدير التقارير</span>
        </Button>
      </div>
    </div>
  )
}
