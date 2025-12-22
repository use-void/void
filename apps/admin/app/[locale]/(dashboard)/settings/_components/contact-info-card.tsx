"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui";
import { Input } from "@repo/ui";
import { StoreConfigFormValues } from "@/lib/schemas/store-config.schema";

export function ContactInfoCard() {
    const t = useTranslations("Admin.settings.contact");
    const { control } = useFormContext<StoreConfigFormValues>();

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-base">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={control}
                        name="contact.supportEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("email_label")}</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input {...field} className="pl-9" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="contact.supportPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("phone_label")}</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input {...field} className="pl-9" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
