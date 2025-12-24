"use client"

import { Plus, Filter, ChevronRight } from "lucide-react"
import { 
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn
} from "@repo/ui"
import { useTranslations } from "next-intl"
import { Link } from "@repo/i18n/navigation"
import { PRODUCT_TYPES } from "@/types/product"

interface ProductPageHeaderProps {
  title: string
  description: string
}

export function ProductPageHeader({ title, description }: ProductPageHeaderProps) {
  const t = useTranslations("Admin.products")

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-8">
      <div className="space-y-1 text-start">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
          <Filter className="h-4 w-4" />
          <span>{t("filter")}</span>
        </Button>
        <Dialog>
          <DialogTrigger 
            render={
              <Button className="h-11 px-5 bg-foreground hover:bg-foreground/90 text-background font-semibold gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="h-5 w-5" />
                <span>{t("add")}</span>
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border bg-background">
            <DialogHeader className="p-6 pb-2 text-start">
              <DialogTitle className="text-xl font-semibold tracking-tight">{t("add")}</DialogTitle>
              <DialogDescription className="text-sm">
                Choose a product type to continue.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-0.5 p-3">
              {Object.values(PRODUCT_TYPES).map((type) => (
                <Link 
                  key={type.id} 
                  href={`/products/add?type=${type.id}`}
                  className="group"
                >
                  <div className="flex items-center gap-4 p-4  hover:bg-secondary/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/50">
                    <div className={cn(
                      "flex items-center justify-center transition-colors",
                      type.color || "text-foreground"
                    )}>
                      <type.icon className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    
                    <div className="flex-1 space-y-0.5">
                      <h4 className="font-medium text-[15px] group-hover:text-primary transition-colors">
                        {type.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {type.description}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-4 bg-muted/30 border-t border-border/50">
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider font-semibold">
                Quick Selection
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
