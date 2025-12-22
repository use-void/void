"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { FormControl, FormField, FormItem, FormLabel } from "@repo/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { StoreConfigFormValues } from "@/lib/schemas/store-config.schema";

export function RegionalFormatsCard() {
    const t = useTranslations("Admin.settings.localization.formats");
    const { control } = useFormContext<StoreConfigFormValues>();

    return (
        <Card>
            <CardHeader className="pb-4">
                 <CardTitle className="text-base">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={control}
                        name="localization.timezone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("timezone")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || "Asia/Riyadh"}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue>
                                                 {field.value ? undefined : <span>Select Timezone</span>}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Asia/Riyadh">(GMT+03:00) Riyadh</SelectItem>
                                        <SelectItem value="UTC">UTC</SelectItem>
                                        <SelectItem value="America/New_York">(GMT-05:00) New York</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <FormLabel>{t("unit_system")}</FormLabel>
                        <Select disabled value="metric">
                            <SelectTrigger>
                                <SelectValue>
                                    <span>Metric (kg, cm)</span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                                <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <FormLabel>{t("date_format")}</FormLabel>
                        <Select disabled value="ddmmyyyy">
                            <SelectTrigger>
                                <SelectValue>
                                    <span>DD/MM/YYYY</span>
                                </SelectValue>
                            </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                                <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
