"use client"

import * as React from "react"
import { useRouter } from "@repo/i18n/navigation"
import { 
  Save, 
  RotateCcw
} from "lucide-react"
import { 
  Button,
  cn
} from "@repo/ui"
import { useTranslations } from "next-intl"
import { FormHeader } from "@/components/layout/headers/header-form"

interface ProductEditorProps {
  productId?: string
  productType?: string // simplified
  initialData?: any
}

export function ProductEditor({ productId }: ProductEditorProps) {
  const t = useTranslations("Admin.products")
  const router = useRouter()

  return (
    <div className="flex flex-col w-full min-h-screen">
      <FormHeader 
        title={productId ? t("details.title") : t("add")}
        description={productId ? "SKU: ..." : "Product"}
        backHref="/products"
        primaryAction={
            <Button size="sm" className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
            </Button>
        }
        secondaryAction={
            <Button size="sm" variant="ghost" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Discard
            </Button>
        }
      />

      <div className="w-full px-6 lg:px-10 py-8">
        {/* Empty Page Content as requested */}
        <div className="border-2 border-dashed border-border/20 rounded-xl p-10 flex items-center justify-center text-muted-foreground h-96">
            Page Content Area
        </div>
      </div>
    </div>
  )
}
