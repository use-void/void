"use client";

import { useTranslations } from "next-intl";
import { LayoutGrid, Globe, CreditCard, Bell, Users, BookOpen } from "lucide-react";
import { cn } from "@repo/ui";
import { Button } from "@repo/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";

interface SettingsNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
    const t = useTranslations("Admin.settings.sidebar");

    const items = [
        { id: "general", label: t("general"), icon: LayoutGrid },
        { id: "localization", label: t("localization"), icon: Globe },
        { id: "payments", label: t("payments"), icon: CreditCard },
        { id: "notifications", label: t("notifications"), icon: Bell },
        { id: "team", label: t("team"), icon: Users },
    ];

    return (
        <div className="space-y-6">
             <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1 ">{t("title")}</h2>
             </div>

            <nav className="flex flex-col space-y-1">
                {items.map((item) => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className={cn(
                            "justify-start gap-3 px-3",
                            activeTab === item.id 
                                ? "bg-muted font-medium hover:bg-muted" 
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={(e) => {
                            e.preventDefault(); // Prevent form submission if inside form
                            onTabChange(item.id);
                        }}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Button>
                ))}
            </nav>

            <Card className="mt-auto bg-muted/50 border-none shadow-none">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">{t("help_title")}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <p className="text-xs text-muted-foreground mb-3">
                        {t("help_desc")}
                    </p>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                        <BookOpen className="mr-2 h-3 w-3" />
                        {t("read_docs")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
