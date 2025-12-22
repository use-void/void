"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui";
import { Input } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { StoreConfigFormValues } from "@/lib/schemas/store-config.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";

export function BasicInfoCard() {
    const t = useTranslations("Admin.settings.basic_info");
    const { control } = useFormContext<StoreConfigFormValues>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>
                    {t("description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>
                    
                    {["en", "ar"].map((lang) => (
                        <TabsContent key={lang} value={lang} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={control}
                                    name={`name.${lang}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Store Name ({lang.toUpperCase()})</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`slogan.${lang}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slogan / Legal Name ({lang.toUpperCase()})</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={control}
                                name={`description.${lang}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description ({lang.toUpperCase()})</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                {...field} 
                                                value={field.value || ""} 
                                                className="min-h-[100px]"
                                            />
                                        </FormControl>
                                        <div className="flex justify-end">
                                            <span className="text-xs text-muted-foreground">SEO Optimized</span>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
