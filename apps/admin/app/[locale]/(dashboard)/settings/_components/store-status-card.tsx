"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MapPin, Store } from "lucide-react";
import { Card, CardContent } from "@repo/ui";
import { StoreConfigFormValues } from "@/lib/schemas/store-config.schema";

export function StoreStatusCard() {
    const t = useTranslations("Admin.settings.status");
    const { watch } = useFormContext<StoreConfigFormValues>();
    
    const isMaintenance = watch("shopSettings.isMaintenanceMode");
    const timezone = watch("localization.timezone");

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{t("store_status")}:</span>
                        <span className={`text-sm ${!isMaintenance ? "text-green-500" : "text-yellow-500"}`}>
                            {isMaintenance ? t("maintenance") : t("active")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{timezone}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                        {t("visibility_note")}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
