"use client";

import { useTranslations } from "next-intl";
import { StoreBrandCard } from "../store-brand-card";
import { StoreStatusCard } from "../store-status-card";
import { BasicInfoCard } from "../basic-info-card";
import { ContactInfoCard } from "../contact-info-card";
import { SocialsCard } from "../socials-card";

export function GeneralView() {
    const t = useTranslations("Admin.settings.general");

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-semibold tracking-tight">{t("title_view")}</h2>
                <p className="text-sm text-muted-foreground">
                    {t("desc_view")}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-1">
                    <StoreBrandCard />
                    <StoreStatusCard />
                </div>
                
                <div className="space-y-6 lg:col-span-2">
                    <BasicInfoCard />
                    <ContactInfoCard />
                    <SocialsCard />
                </div>
            </div>
        </div>
    );
}
