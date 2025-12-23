import { Plus, Filter } from "lucide-react"
import { Button } from "@repo/ui"
import { useTranslations } from "next-intl"

interface ProductPageHeaderProps {
  title: string
  description: string
}

export function ProductPageHeader({ title, description }: ProductPageHeaderProps) {
  const t = useTranslations("Products")

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-8">
      <div className="space-y-1 text-start">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 rounded-xl">
          <Filter className="h-4 w-4" />
          <span>{t("filter")}</span>
        </Button>
        <Button className="h-11 px-5 bg-foreground hover:bg-foreground/90 text-background font-semibold gap-2 rounded-xl">
          <Plus className="h-5 w-5" />
          <span>{t("add")}</span>
        </Button>
      </div>
    </div>
  )
}
