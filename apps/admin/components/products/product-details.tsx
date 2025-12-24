import { getTranslations } from "@repo/i18n";
import { 
  ImageIcon, 
  Package, 
  Tag, 
  Calendar, 
  Weight,
  ArrowUpRight,
  ShoppingCart,
  DollarSign
} from "lucide-react"
import { 
  Badge, 
  Skeleton,
  cn
} from "@repo/ui"
import Image from "next/image"

async function getProductDetails(id: string) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
        id,
        name: "سماعات نويز كانسيلنج برو",
        description: "سماعات عالية الجودة مع تقنية إلغاء الضوضاء النشطة، تصميم مريح وعمر بطارية طويل يصل إلى 40 ساعة. مثالية للسفر والعمل المكتبي بتصميم عصري وأنيق.",
        price: "1,299",
        compareAtPrice: "1,499",
        sku: "AUD-NC-001",
        stock: 45,
        category: "إلكترونيات",
        status: "نشط",
        weight: "0.25",
        unit: "kg",
        updatedAt: "2023-10-24",
        totalSales: 284,
        totalRevenue: "368,916",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"
    };
}

export async function ProductDetails({ productId }: { productId: string }) {
    const product = await getProductDetails(productId);
    const t = await getTranslations("Admin.products");

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'نشط': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            case 'مؤرشف': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
            case 'مسودة': return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20'
            default: return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20'
        }
    }

    return (
        <div className="flex flex-col w-full pb-10 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Media Column (Left - 33% width desktop) */}
                <div className="space-y-4">
                    <div className="group relative aspect-square w-full  bg-muted border border-border overflow-hidden">
                        {product.image ? (
                            <Image 
                                src={product.image} 
                                alt={product.name} 
                                fill 
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                        )}
                        
                        <div className="absolute top-4 right-4">
                            <Badge className={cn(
                                "px-3 py-1 text-[10px] font-bold tracking-wider uppercase  border  backdrop-blur-md",
                                getStatusColor(product.status)
                            )}>
                                {product.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {[1, 2, 3].map(i => (
                             <div key={i} className="h-16 w-16 shrink-0  border border-border bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors overflow-hidden">
                                {product.image && (
                                     <Image src={product.image} alt="" width={64} height={64} className="object-cover opacity-60" unoptimized />
                                )}
                             </div>
                        ))}
                    </div>
                </div>

                {/* Data Column (Right - 66% width desktop) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Info */}
                    <div className="space-y-4 text-start">
                        <div className="flex flex-col gap-2">
                           <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                               {product.name}
                           </h1>
                           <div className="flex items-center gap-3 mt-1">
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-foreground text-background ">
                                   <span className="text-2xl font-black tabular-nums tracking-tighter">
                                       {product.price}
                                   </span>
                                   <span className="text-[10px] font-bold uppercase opacity-80">{t("currency")}</span>
                               </div>
                               {product.compareAtPrice && (
                                   <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/40 opacity-50 font-medium">
                                       {product.compareAtPrice} {t("currency")}
                                   </span>
                               )}
                           </div>
                        </div>
                        
                        <div className="max-w-2xl">
                           <p className="text-muted-foreground text-lg leading-relaxed">
                               {product.description}
                           </p>
                        </div>
                    </div>

                    {/* Metadata Matrix */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6  border border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10  bg-background flex items-center justify-center text-primary  border border-border/10">
                                <Tag className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">{t("table.category")}</span>
                                <span className="font-bold text-xs tracking-tight">{product.category}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10  bg-background flex items-center justify-center text-primary  border border-border/10">
                                <Package className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">{t("table.stock")}</span>
                                <span className={cn(
                                    "font-bold text-xs tracking-tight",
                                    product.stock < 10 ? "text-destructive" : "text-foreground"
                                )}>
                                    {product.stock} {product.stock < 10 && " (منخفض)"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10  bg-background flex items-center justify-center text-primary  border border-border/10">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">آخر تحديث</span>
                                <span className="font-bold text-xs font-mono tracking-tighter">{product.updatedAt}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10  bg-background flex items-center justify-center text-primary  border border-border/10">
                                <Weight className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">وزن الشحن</span>
                                <span className="font-bold text-xs tracking-tight">{product.weight} {product.unit}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative overflow-hidden group p-8  border border-border">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                <ShoppingCart className="h-24 w-24 text-primary" />
                            </div>
                            <div className="relative z-10 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-primary tracking-[0.1em] uppercase opacity-70">إجمالي المبيعات</span>
                                    <div className="flex items-center text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5  border border-emerald-500/20">
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                        12%
                                    </div>
                                </div>
                                <span className="text-5xl font-black text-foreground tabular-nums tracking-tighter">
                                    {product.totalSales}
                                </span>
                                <p className="text-[10px] text-muted-foreground font-bold mt-2 uppercase tracking-tight">قطعة تم بيعها تاريخياً</p>
                            </div>
                        </div>

                        <div className="relative overflow-hidden group p-8  border border-border">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                <DollarSign className="h-24 w-24 text-foreground" />
                            </div>
                            <div className="relative z-10 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-muted-foreground tracking-[0.1em] uppercase opacity-70">إجمالي الإيرادات</span>
                                    <div className="flex items-center text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5  border border-emerald-500/20">
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                        8.4%
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-foreground tabular-nums tracking-tighter">
                                        {product.totalRevenue}
                                    </span>
                                    <span className="text-lg font-bold text-muted-foreground uppercase">{t("currency")}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold mt-2 uppercase tracking-tight">عوائد المحققة عبر المتجر</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function ProductDetailsSkeleton() {
    return (
        <div className="flex flex-col w-full pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full bg-muted/50" />
                    <div className="flex gap-2">
                        {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-16 bg-muted/50" />)}
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-3/4 bg-muted/50" />
                        <Skeleton className="h-10 w-1/4 bg-muted/50" />
                        <Skeleton className="h-24 w-full bg-muted/50" />
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-6 bg-muted/40  border border-border/50">
                        {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full bg-muted/50" />)}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Skeleton className="h-48 w-full bg-muted/50" />
                        <Skeleton className="h-48 w-full bg-muted/50" />
                    </div>
                </div>
            </div>
        </div>
    );
}
