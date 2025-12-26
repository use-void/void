import Link from "next/link";
import { getTranslations, setRequestLocale } from "@repo/i18n";
import { Card, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { PageHeader } from "@/components/layout/headers/header-page";
import { 
    Store, 
    Languages, 
    Coins, 
    Contact, 
    Settings2, 
    Search, 
    ShieldCheck 
} from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.settings" });
    return {
        title: t("title"),
    };
}

export default async function SettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "Admin.settings" });

    const settingsSections = [
        {
            id: "general",
            title: t("sections.general"),
            description: t("general.basicInfo.description"),
            icon: Store,
            href: `/${locale}/settings/general`,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            id: "language",
            title: t("sections.localization"), // Or a combined title if available
            description: t("localization.regional.description"),
            icon: Languages,
            href: `/${locale}/settings/language`,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            id: "contact",
            title: t("sections.contact"),
            description: t("contact.support.description"),
            icon: Contact,
            href: `/${locale}/settings/contact`,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            id: "shop",
            title: t("sections.shop"),
            description: t("shop.maintenance.description"),
            icon: Settings2,
            href: `/${locale}/settings/shop`,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
        },
        {
            id: "seo",
            title: t("sections.seo"),
            description: t("seo.general.description"),
            icon: Search,
            href: `/${locale}/settings/seo`,
            color: "text-sky-500",
            bg: "bg-sky-500/10",
        },
        {
            id: "policies",
            title: t("sections.policies"),
            description: t("policies.description"),
            icon: ShieldCheck,
            href: `/${locale}/settings/policies`,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
        },
    ];

    return (
        <div className="flex flex-col w-full min-h-screen pb-20">
            <PageHeader 
                title={t("title")} 
                description={t("description")} 
            />

            <div className="w-full px-6 lg:px-10 py-8">
                {/* Grid - Clean, spacing matching reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {settingsSections.map((section) => (
                        <Link key={section.id} href={section.href}>
                            <Card className="h-44 flex flex-col items-center justify-center p-6 hover:bg-[#141414] transition-colors group cursor-pointer text-center space-y-4">
                                <div className="w-12 h-12 border flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                                        {section.title}
                                    </h3>
                                    <p className="text-[11px] text-muted-foreground leading-tight px-2">
                                        {section.description}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

