import { 
  Badge, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  cn,
  Button
} from "@repo/ui";
import { 
  Package, 
  Truck, 
  Check,
  CreditCard,
  Mail,
  Phone,
  User,
  ArrowRight,
  MapPin,
  ExternalLink,
  Download,
  Key,
  Globe
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

// Mock Data
const ORDER_DATA = {
  id: "ORD-99281",
  type: "digital" as "physical" | "digital", 
  date: "Dec 24, 2025 at 4:30 PM",
  status: "processing",
  timeline: [
    { label: "Placed", date: "4:30 PM", completed: true, current: false },
    { label: "Confirmed", date: "4:35 PM", completed: true, current: false },
    { label: "Delivered", date: "4:35 PM", completed: true, current: true },
  ],
  items: [
    {
      id: "1",
      name: "اشتراك باقة المحترفين - سنة",
      sku: "SUB-PRO-1Y",
      price: 1500,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    }
  ],
  logistics: {
    payment: {
      method: "Visa",
      last4: "4242",
      transactionId: "TXN_88291029",
      status: "Paid"
    },
    shipping: {
      carrier: "Aramex",
      trackingNumber: "ARM-9920-X1",
      expectedArrival: "Dec 27, 2025"
    },
    digital: {
      downloadUrl: "https://download.store.com/file/v1/setup.exe",
      licenseKey: "XXXX-YYYY-ZZZZ-WWWW",
      deliveredAt: "Dec 24, 2025 at 4:35 PM",
      method: "Email Delivery"
    }
  },
  customer: {
    name: "أحمد العتيبي",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    avatar: "https://i.pravatar.cc/150?u=ahmed",
    ordersCount: 12,
    address: {
      street: "طريق الملك فهد",
      district: "حي المروج",
      city: "الرياض",
      postalCode: "12283",
      country: "المملكة العربية السعودية"
    }
  },
  financials: {
    subtotal: 2599,
    discount: 100,
    shipping: 25,
    tax: 374.85,
    total: 2898.85
  }
};

export function OrderDetails() {
  const t = useTranslations("Admin.orders.details");
  const isDigital = ORDER_DATA.type === "digital";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Column (66%) */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Timeline & Shipping Component - Only for Physical */}
        {!isDigital && (
            <Card className="border-border bg-card overflow-hidden ">
            <CardContent className="p-8 pb-4">
                <div className="flex items-center justify-between w-full relative">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0" />
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: '40%' }} // Mocked progress
                />

                {ORDER_DATA.timeline.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center gap-3 bg-card px-2">
                    <div className={cn(
                        "h-8 w-8  flex items-center justify-center border-2 transition-all duration-300",
                        step.completed ? "bg-primary border-primary text-background" : 
                        step.current ? "bg-background border-primary text-primary" : 
                        "bg-background border-muted text-muted-foreground"
                    )}>
                        {step.completed ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <div className="flex flex-col items-center">
                        <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        step.current ? "text-primary" : "text-muted-foreground"
                        )}>
                        {step.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground opacity-70">{step.date}</span>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            
            {/* Linked Shipping Info in Footer */}
            <div className="bg-muted/30 border-t border-border p-5 px-8 flex flex-wrap items-center justify-between gap-6 overflow-hidden">
                <div className="flex items-center gap-3 min-w-[150px]">
                    <div className="h-10 w-10  bg-background border border-border flex items-center justify-center text-muted-foreground ">
                        <Truck className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-60 text-start">{t("logistics.partner")}</span>
                        <span className="text-sm font-bold">{ORDER_DATA.logistics.shipping.carrier}</span>
                    </div>
                </div>

                <div className="flex flex-col min-w-[150px]">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-60 text-start">{t("logistics.tracking")}</span>
                    <div className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-sm font-mono font-black text-primary">{ORDER_DATA.logistics.shipping.trackingNumber}</span>
                        <ExternalLink className="h-3 w-3 text-primary" />
                    </div>
                </div>

                <div className="flex flex-col text-end min-w-[150px]">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-60">{t("logistics.arrival")}</span>
                    <span className="text-sm font-bold text-foreground">{ORDER_DATA.logistics.shipping.expectedArrival}</span>
                </div>
            </div>
            </Card>
        )}

        {/* Digital Delivery Section - Only for Digital */}
        {isDigital && (
           <Card className="border-border bg-card overflow-hidden">
             <CardHeader className="p-6 border-b border-border bg-muted/10">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {t("digitalDelivery.title")}
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
                    <div className="p-6 flex items-start gap-4">
                        <div className="h-10 w-10  bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                            <Download className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{t("digitalDelivery.downloadLink")}</span>
                            <a href={ORDER_DATA.logistics.digital.downloadUrl} className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                                Setup_v1.2.exe
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                    <div className="p-6 flex items-start gap-4">
                        <div className="h-10 w-10  bg-emerald-500/5 flex items-center justify-center text-emerald-600 border border-emerald-500/10">
                            <Key className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{t("digitalDelivery.licenseKey")}</span>
                            <span className="text-sm font-mono font-black select-all cursor-copy">{ORDER_DATA.logistics.digital.licenseKey}</span>
                        </div>
                    </div>
                </div>
                <div className="p-5 px-8 bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[9px] font-bold uppercase text-muted-foreground">{t("digitalDelivery.method")}</span>
                            <span className="text-xs font-bold">{ORDER_DATA.logistics.digital.method}</span>
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[9px] font-bold uppercase text-muted-foreground">{t("digitalDelivery.delivered")}</span>
                            <span className="text-xs font-bold">{ORDER_DATA.logistics.digital.deliveredAt}</span>
                        </div>
                    </div>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold uppercase tracking-widest px-3">
                        {t("digitalDelivery.delivered")}
                    </Badge>
                </div>
             </CardContent>
           </Card>
        )}

        {/* Order Items Table */}
        <Card className="border-border overflow-hidden ">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t("items")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-start">Product</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Unit Price</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Quantity</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-end">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ORDER_DATA.items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16  overflow-hidden border border-border bg-muted shrink-0 relative">
                            <Image fill src={item.image} alt={item.name} className="object-cover" />
                          </div>
                          <div className="flex flex-col gap-1 items-start">
                            <span className="font-bold text-sm leading-tight text-start">{item.name}</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">SKU: {item.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center font-medium text-sm">{item.price.toLocaleString()} SAR</td>
                      <td className="px-6 py-5 text-center font-bold text-sm">× {item.quantity}</td>
                      <td className="px-6 py-5 text-end font-bold text-sm text-primary">{(item.price * item.quantity).toLocaleString()} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Logistics & Financial Summary Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Card */}
          <Card className="border-border overflow-hidden ">
            <CardHeader className="p-6 border-b border-border">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 text-start">
                <CreditCard className="h-4 w-4" />
                {t("payment")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-12 bg-secondary  flex items-center justify-center border border-border">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-sm font-bold">{ORDER_DATA.logistics.payment.method} **** {ORDER_DATA.logistics.payment.last4}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Status: <span className="text-emerald-500 font-bold">{ORDER_DATA.logistics.payment.status}</span></span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border flex flex-col items-start">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter opacity-70 mb-1">Transaction Reference</p>
                <p className="text-sm font-mono font-medium">{ORDER_DATA.logistics.payment.transactionId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary card */}
          <Card className="border-border overflow-hidden ">
            <CardHeader className="p-6 border-b border-border text-start">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">{ORDER_DATA.financials.subtotal.toLocaleString()} SAR</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{ORDER_DATA.financials.discount.toLocaleString()} SAR</span>
              </div>
              {!isDigital && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-bold">{ORDER_DATA.financials.shipping.toLocaleString()} SAR</span>
                  </div>
              )}
              <div className="flex justify-between text-sm pb-2">
                  <span className="text-muted-foreground">Tax (15%)</span>
                  <span className="font-bold">{ORDER_DATA.financials.tax.toLocaleString()} SAR</span>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Grand Total</span>
                  <span className="text-3xl font-black text-primary leading-none">
                      {ORDER_DATA.financials.total.toLocaleString()} <span className="text-sm">SAR</span>
                  </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sidebar Column (33%) */}
      <div className="space-y-6">
        {/* Customer Card */}
        <Card className="border-border overflow-hidden ">
          <CardHeader className="p-6 pb-3 text-start border-b border-border">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Customer Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-6">
             <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-14 w-14 border-2 border-background ">
                    <AvatarImage src={ORDER_DATA.customer.avatar} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-start items-start">
                    <span className="font-bold text-lg">{ORDER_DATA.customer.name}</span>
                    <Badge variant="secondary" className="w-fit text-[10px] font-bold uppercase mt-1">
                      {ORDER_DATA.customer.ordersCount > 1 ? 'Returning Customer' : 'New Customer'}
                    </Badge>
                </div>
             </div>
             
             <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm group cursor-pointer">
                    <div className="h-9 w-9  bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                        <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-muted-foreground font-semibold group-hover:text-foreground transition-colors">{ORDER_DATA.customer.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm group cursor-pointer">
                    <div className="h-9 w-9  bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                        <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-muted-foreground font-semibold group-hover:text-foreground transition-colors">{ORDER_DATA.customer.phone}</span>
                </div>
             </div>
             
             <Button variant="outline" className="w-full mt-6  font-bold gap-2 text-[10px] uppercase tracking-widest h-11 border-border/60 hover:bg-secondary">
                View Account Profile
                <ArrowRight className="h-3 w-3" />
             </Button>
          </CardContent>
        </Card>

        {/* Address Card - Only for Physical */}
        {!isDigital && (
            <Card className="border-border overflow-hidden ">
            <CardHeader className="p-6 pb-3 text-start border-b border-border">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Shipping Destination
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-6 text-start">
                <div className="space-y-1.5">
                    <p className="font-bold text-[15px]">{ORDER_DATA.customer.address.street}</p>
                    <p className="text-sm font-medium text-muted-foreground">{ORDER_DATA.customer.address.district}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                        {ORDER_DATA.customer.address.city}, {ORDER_DATA.customer.address.postalCode}
                    </p>
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary pt-3">{ORDER_DATA.customer.address.country}</p>
                </div>
            </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="animate-spin  h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
