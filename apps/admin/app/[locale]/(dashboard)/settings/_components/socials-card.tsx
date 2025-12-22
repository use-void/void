"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui";
import { Input } from "@repo/ui";
import { StoreConfigFormValues } from "@/lib/schemas/store-config.schema";

export function SocialsCard() {
    const t = useTranslations("Admin.settings.socials");
    const { control } = useFormContext<StoreConfigFormValues>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>
                    {t("description")}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <FormField
                    control={control}
                    name="contact.socialLinks.instagram"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                            <FormLabel className="col-span-1">Instagram</FormLabel>
                            <FormControl className="col-span-3">
                                <Input {...field} placeholder="https://instagram.com/..." value={field.value || ""} />
                            </FormControl>
                            <FormMessage className="col-span-4" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="contact.socialLinks.twitter"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                            <FormLabel className="col-span-1">Twitter / X</FormLabel>
                            <FormControl className="col-span-3">
                                <Input {...field} placeholder="https://twitter.com/..." value={field.value || ""} />
                            </FormControl>
                            <FormMessage className="col-span-4" />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
