"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui";
import { Input } from "@repo/ui";
import { StoreConfigFormValues } from "@/lib/schemas/store-config.schema";

export function StoreBrandCard() {
    const t = useTranslations("Admin.settings.brand");
    const { control } = useFormContext<StoreConfigFormValues>();
    
    // Just a placeholder visualization for now since we don't have a real upload component yet

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>
                   {t("description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={control}
                    name="assets.logoPrimary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">{t("logo_label")}</FormLabel>
                            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors hover:bg-muted/50">
                                {field.value ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={field.value} 
                                        alt="Store Logo" 
                                        className="aspect-square h-32 w-32 object-contain"
                                    />
                                ) : (
                                    <div className="flex aspect-square h-32 w-32 items-center justify-center rounded-full bg-muted">
                                        <Upload className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="text-sm font-medium">{t("logo_placeholder")}</p>
                                    <p className="text-xs text-muted-foreground">{t("logo_help")}</p>
                                </div>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        placeholder="https://..." 
                                        className="max-w-xs text-center text-xs" 
                                        type="url"
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
