"use client";

import { useTranslations } from "next-intl";
import { LanguagesCard } from "../languages-card";
import { CurrenciesCard } from "../currencies-card";
import { RegionalFormatsCard } from "../regional-formats-card";

export function LocalizationView() {
    const t = useTranslations("Admin.settings.localization");

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
                <h2 className="text-xl font-semibold tracking-tight">{t("title_view")}</h2>
                <p className="text-sm text-muted-foreground">
                    {t("desc_view")}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LanguagesCard />
                <CurrenciesCard />
            </div>

            <RegionalFormatsCard />
        </div>
    );
}
