"use client"

import * as React from "react"
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
  Button,
  Separator
} from "@repo/ui"
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MapPin, 
  Tag as TagIcon, 
  Plus, 
  MessageSquare, 
  Ticket, 
  History, 
  Wallet,
  ShoppingBag,
  TrendingUp,
  X,
  StickyNote
} from "lucide-react"
import { useTranslations } from "next-intl"

// Mock Data Structure
const CUSTOMER_DATA = {
  id: "CUST-8812",
  name: "نورة القحطاني",
  email: "noura.q@example.com",
  phone: "+966 55 998 1234",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
  status: "active",
  joinDate: "2023-11-15",
  loyaltyTier: "Platinum",
  totalLTV: 15420.50,
  ordersCount: 24,
  avgOrderValue: 642.50,
  lastOrderDate: "2025-12-20",
  tags: ["VIP", "Frequent Buyer", "Tech Enthusiast"],
  notes: "تفضل التواصل عبر الواتساب. مهتمة دائماً بإصدارات سماعات آبل الجديدة.",
  address: {
    city: "جدة",
    district: "حي الشاطئ",
    street: "شارع الكورنيش",
    country: "المملكة العربية السعودية"
  }
}

interface CustomerDetailsProps {
    customerId: string;
}

export function CustomerDetails({ customerId }: CustomerDetailsProps) {
  const t = useTranslations("Admin.customers.details")
  const [tags, setTags] = React.useState(CUSTOMER_DATA.tags)
  const [newTag, setNewTag] = React.useState("")
  const [isAddingTag, setIsAddingTag] = React.useState(false)

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
      setIsAddingTag(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Content Column (2/3) */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Stats Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: t("stats.ltv"), value: `${CUSTOMER_DATA.totalLTV.toLocaleString()} SAR`, icon: Wallet, color: "text-emerald-500" },
                { label: t("stats.orders"), value: CUSTOMER_DATA.ordersCount, icon: ShoppingBag, color: "text-blue-500" },
                { label: t("stats.avgOrder"), value: `${CUSTOMER_DATA.avgOrderValue.toLocaleString()} SAR`, icon: TrendingUp, color: "text-orange-500" },
                { label: t("stats.tier"), value: CUSTOMER_DATA.loyaltyTier, icon: User, color: "text-purple-500" },
            ].map((stat, i) => (
                <Card key={i} className="border-border bg-card">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                        <stat.icon className={cn("h-5 w-5 opacity-80", stat.color)} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">{stat.label}</span>
                            <span className="text-sm font-black">{stat.value}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Order History (Mocked List) */}
        <Card className="border-border overflow-hidden">
          <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <History className="h-4 w-4" />
              {t("recentOrders")}
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[
                { id: "ORD-9921", date: "2025-12-20", total: 1299, status: "Delivered" },
                { id: "ORD-9854", date: "2025-11-05", total: 450, status: "Shipped" },
                { id: "ORD-9712", date: "2025-10-12", total: 890, status: "Delivered" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col text-start">
                    <span className="font-bold text-sm">#{order.id}</span>
                    <span className="text-xs text-muted-foreground">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-sm tabular-nums">{order.total.toLocaleString()} SAR</span>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="border-border bg-card">
            <CardHeader className="p-6 pb-2 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    {t("internalNotes")}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <textarea 
                  className="w-full min-h-[120px] bg-muted/20 border border-border p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-start"
                  defaultValue={CUSTOMER_DATA.notes}
                  placeholder={t("notesPlaceholder")}
                />
                <div className="flex justify-end mt-4">
                  <Button size="sm" className="text-[10px] font-bold uppercase tracking-widest">
                    {t("saveNotes")}
                  </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Sidebar Column (1/3) */}
      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="border-border overflow-hidden">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={CUSTOMER_DATA.avatar} alt={CUSTOMER_DATA.name} />
                <AvatarFallback><User size={40} /></AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 border border-background" />
            </div>
            
            <h2 className="text-xl font-bold mb-1">{CUSTOMER_DATA.name}</h2>
            <p className="text-xs text-muted-foreground font-mono tracking-tighter uppercase mb-6 opacity-60">ID: {CUSTOMER_DATA.id}</p>
            
            <div className="flex flex-col w-full gap-3 text-start">
              <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">{CUSTOMER_DATA.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{CUSTOMER_DATA.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Joined {CUSTOMER_DATA.joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card className="border-border bg-card">
          <CardHeader className="p-6 pb-2 border-b border-border">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {t("primaryAddress")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-start">
            <div className="space-y-1">
                <p className="text-sm font-bold">{CUSTOMER_DATA.address.street}</p>
                <p className="text-xs text-muted-foreground">{CUSTOMER_DATA.address.district}</p>
                <p className="text-xs text-muted-foreground">{CUSTOMER_DATA.address.city}, {CUSTOMER_DATA.address.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tags Card (Interactive) */}
        <Card className="border-border bg-card">
          <CardHeader className="p-6 pb-2 border-b border-border flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TagIcon className="h-3 w-3" />
              {t("tags")}
            </CardTitle>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setIsAddingTag(!isAddingTag)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-secondary/50 border-border/50 text-[10px] font-bold uppercase tracking-wider py-1 pl-2 pr-1 gap-1"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {isAddingTag && (
              <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <input 
                  type="text" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="bg-muted/30 border border-border px-3 py-1.5 text-xs focus:outline-none w-full"
                  placeholder="Press enter to add..."
                  autoFocus
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <div className="space-y-3 pt-2">
            <Button className="w-full gap-2 font-bold text-[10px] tracking-widest uppercase h-11">
                <MessageSquare className="h-4 w-4" />
                {t("actions.sendMessage")}
            </Button>
            <Button variant="outline" className="w-full gap-2 font-bold text-[10px] tracking-widest uppercase h-11 border-border">
                <Ticket className="h-4 w-4" />
                {t("actions.addDiscount")}
            </Button>
            <Separator className="bg-border/50 my-4" />
            <Button variant="ghost" className="w-full gap-2 font-bold text-[10px] tracking-widest uppercase h-11 text-destructive hover:bg-destructive/5 hover:text-destructive">
                {t("actions.deleteCustomer")}
            </Button>
        </div>
      </div>
    </div>
  )
}

export function CustomerDetailsSkeleton() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}
