import { CustomerTable } from "@/components/customers/customer-table";
import { PageHeader } from "@/components/layout/headers/header-page";
import { FileDown } from "lucide-react";
import { getTranslations, setRequestLocale } from "@repo/i18n";
import { Button } from "@repo/ui";

// Mock data for customers
const MOCK_CUSTOMERS = [
  {
    id: "C-1001",
    name: "علي بن سعود",
    email: "ali@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256",
    totalOrders: 12,
    totalSpent: "4,500",
    lastActive: "منذ ساعتين",
    status: "نشط"
  },
  {
    id: "C-1002",
    name: "ليلى العامري",
    email: "layla@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256",
    totalOrders: 8,
    totalSpent: "2,890",
    lastActive: "منذ يوم",
    status: "نشط"
  },
  {
    id: "C-1003",
    name: "عمر الفاروق",
    email: "omar@example.com",
    totalOrders: 0,
    totalSpent: "0",
    lastActive: "منذ شهر",
    status: "غير نشط"
  },
  {
    id: "C-1004",
    name: "ريم عبدالله",
    email: "reem@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256",
    totalOrders: 25,
    totalSpent: "15,200",
    lastActive: "الآن",
    status: "نشط"
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.customers" });
    return {
        title: t("title"),
    };
}

export default async function CustomersPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Admin.customers");
    
    return (
        <div className="flex flex-col w-full min-h-screen pb-20">
            <PageHeader 
                title={t("title")} 
                description={t("header.description")}
                actions={
                  <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
                    <FileDown className="h-4 w-4" />
                    <span>تصدير</span>
                  </Button>
                }
            />
            <div className="w-full px-6 lg:px-10 py-8">
                <CustomerTable customers={MOCK_CUSTOMERS} />
            </div>
        </div>
    );
}
