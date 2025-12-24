"use client"

import * as React from "react"
import { useRouter } from "@repo/i18n/navigation"
import { 
  Save, 
  Sparkles, 
  Undo2,
  ChevronDown
} from "lucide-react"
import { 
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@repo/ui"
import { useTranslations } from "next-intl"
import { PRODUCT_TYPES, ProductType } from "@/types/product"

// Import modular sections
import { BasicInfoSection } from "./editor-sections/BasicInfoSection"
import { PricingSection } from "./editor-sections/PricingSection"
import { InventorySection } from "./editor-sections/InventorySection"
import { ShippingSection } from "./editor-sections/ShippingSection"
import { DigitalDeliverySection } from "./editor-sections/DigitalDeliverySection"
import { MediaSection } from "./editor-sections/MediaSection"
import { AnalyticsSection } from "./editor-sections/AnalyticsSection"

// Store & Schema
import { useProductStore } from "./editor/store"
import { ProductFormValues } from "./editor/schema"

interface ProductEditorProps {
  productId?: string
  productType?: ProductType
  initialData?: {
    name: string
    description?: string
    price: string
    sku: string
    stock: number
    status: string
    image?: string
  }
}

const LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

export function ProductEditor({ productId, initialData, productType = "physical" }: ProductEditorProps) {
  const t = useTranslations("Admin.products")
  const router = useRouter()
  
  // Zustand Store Selectors
  const { 
    formValues, 
    activeLocale, 
    init, 
    setActiveLocale, 
    setContentValue, 
    setPricingValue, 
    setInventoryValue, 
    setShippingValue, 
    setStatus,
    isDirty
  } = useProductStore()

  // Initialize store with mapped initial data
  // We use a ref to track if we've initialized to avoid re-init on every render
  const initialized = React.useRef(false)

  React.useEffect(() => {
    if (initialized.current) return
    
    const mappedValues: ProductFormValues = {
      type: productType,
      status: initialData?.status === "نشط" ? "active" : "draft",
      content: {
        ar: { name: initialData?.name || "", description: initialData?.description || "" },
        en: { name: "", description: "" },
        fr: { name: "", description: "" },
        es: { name: "", description: "" },
        de: { name: "", description: "" },
      },
      pricing: {
        price: initialData?.price || "",
        compareAtPrice: "",
        cost: "",
      },
      inventory: {
        sku: initialData?.sku || "",
        barcode: "",
        stock: initialData?.stock || 0,
        trackQuantity: true,
        allowBackorder: false,
      },
      shipping: {
        weight: "",
        unit: "kg",
      },
      image: initialData?.image || null
    }
    
    init(mappedValues)
    initialized.current = true
  }, [initialData, productType, init])

  if (!formValues) return null

  const config = PRODUCT_TYPES[productType]
  const currentLocaleFlag = LANGUAGES.find(l => l.code === activeLocale)?.flag || ""

  const handleAIByLocale = () => {
    console.log("Generating AI content for", activeLocale)
  }

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "basic-info":
        return (
          <BasicInfoSection
            key="basic-info"
            flag={currentLocaleFlag}
            name={formValues.content[activeLocale]?.name || ""}
            description={formValues.content[activeLocale]?.description || ""}
            onNameChange={(val) => setContentValue(activeLocale, 'name', val)}
            onDescriptionChange={(val) => setContentValue(activeLocale, 'description', val)}
          />
        )
      case "pricing":
        return (
          <PricingSection
            key="pricing"
            price={formValues.pricing.price}
            compareAtPrice={formValues.pricing.compareAtPrice || ""}
            cost={formValues.pricing.cost || ""}
            onPricingChange={(field, val) => setPricingValue(field as any, val)}
          />
        )
      case "inventory":
        return (
          <InventorySection
            key="inventory"
            sku={formValues.inventory.sku}
            barcode={formValues.inventory.barcode || ""}
            stock={formValues.inventory.stock}
            trackQuantity={formValues.inventory.trackQuantity}
            allowBackorder={formValues.inventory.allowBackorder}
            onInventoryChange={(field, val) => setInventoryValue(field as any, val)}
          />
        )
      case "shipping":
        return (
          <ShippingSection
            key="shipping"
            weight={formValues.shipping.weight || ""}
            unit={formValues.shipping.unit}
            onShippingChange={(field, val) => setShippingValue(field as any, val)}
          />
        )
      case "digital-delivery":
        return <DigitalDeliverySection key="digital-delivery" />
      default:
        return null
    }
  }

  const primaryLocales = LANGUAGES.slice(0, 2)
  const otherLocalesCount = LANGUAGES.length - 2
  const dirty = isDirty()

  return (
    <div className="flex flex-col w-full min-h-screen pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border ">
        <div className="flex items-center justify-between h-16 w-full px-6 text-start">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="h-9 w-9"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight">
                {productId ? t("details.title") : t("add")} - {config.title}
              </h1>
              {productId && formValues.inventory.sku && (
                 <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-70">
                    SKU: {formValues.inventory.sku}
                 </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Language Selection Bar */}
            <div className="flex items-center bg-secondary/30 border border-border  p-1">
               {primaryLocales.map((lang) => (
                 <button
                   key={lang.code}
                   onClick={() => setActiveLocale(lang.code)}
                   className={cn(
                     "px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                     activeLocale === lang.code 
                       ? "bg-foreground text-background" 
                       : "text-muted-foreground hover:text-foreground"
                   )}
                 >
                   {lang.code}
                 </button>
               ))}
               {otherLocalesCount > 0 && (
                 <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button className="px-3 py-1.5 text-xs font-black text-primary hover:bg-primary/5 transition-colors focus:outline-none hover:opacity-80">
                          +{otherLocalesCount}
                        </button>
                      }
                    />
                   <DropdownMenuContent align="end" className=" border-border bg-card">
                      {LANGUAGES.slice(2).map(lang => (
                        <DropdownMenuItem 
                          key={lang.code} 
                          onClick={() => setActiveLocale(lang.code)}
                          className="text-xs font-bold uppercase py-2 focus:bg-secondary"
                        >
                           <span className="mr-2 opacity-70">{lang.flag}</span>
                           {lang.name}
                        </DropdownMenuItem>
                      ))}
                   </DropdownMenuContent>
                 </DropdownMenu>
               )}
            </div>

            <div className="h-6 w-[1px] bg-border mx-1" />

            <div className="flex items-center gap-2">
              <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden md:flex items-center gap-2 h-9 border-border bg-secondary/20 hover:bg-secondary"
                  onClick={handleAIByLocale}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Craft</span>
              </Button>
              
              {/* Status Dropdown in Header */}
              <DropdownMenu>
                <DropdownMenuTrigger
                   render={
                     <Button variant="outline" size="sm" className="h-9 gap-2 border-border bg-secondary/20 hover:bg-secondary">
                        <div className={cn(
                          "h-2 w-2 ",
                          formValues.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-500"
                        )} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {formValues.status === 'active' ? t("status.active") : t("status.draft")}
                        </span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                     </Button>
                   }
                />
                <DropdownMenuContent align="end" className=" border-border bg-card">
                    <DropdownMenuItem onClick={() => setStatus('active')} className="gap-2 focus:bg-emerald-500/10 text-emerald-600 font-bold text-xs uppercase py-3">
                       <div className="h-2 w-2  bg-emerald-500" />
                       {t("status.active")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatus('draft')} className="gap-2 focus:bg-zinc-500/10 text-zinc-600 font-bold text-xs uppercase py-3">
                       <div className="h-2 w-2  bg-zinc-500" />
                       {t("status.draft")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                size="sm"
                className={cn(
                  "font-bold gap-2 h-9 px-5 transition-all",
                  dirty 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                )}
                disabled={!dirty}
              >
                <Save className="h-4 w-4" />
                <span className="text-xs uppercase tracking-widest">{t("settings.actions.save_changes")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Render dynamic sections from configuration */}
            {config.visibleSections.map(sectionId => renderSection(sectionId))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <MediaSection image={formValues.image ?? null} />
            <AnalyticsSection productId={productId} />
          </div>
        </div>
      </div>
    </div>
  )
}
