"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Plus, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { FormControl, FormField, FormItem } from "@repo/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { Switch } from "@repo/ui";
import { Button } from "@repo/ui";
import { StoreConfigFormValues } from "@/lib/schemas/store-config.schema";
import { Badge } from "@repo/ui";

export function LanguagesCard() {
    const t = useTranslations("Admin.settings.localization.languages");
    const { control, watch } = useFormContext<StoreConfigFormValues>();
    
    // Using simple watch for now as field array management might be complex without a dynamic "Add Language" modal
    // but demonstrating the structure.
    const languages = watch("localization.languages") || [];
    const defaultLang = watch("localization.defaultLanguage");

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Default Language Selector */}
                <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Languages className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{t("default_language")}</p>
                            <p className="text-xs text-muted-foreground">{t("default_language_desc")}</p>
                        </div>
                    </div>
                    <FormField
                        control={control}
                        name="localization.defaultLanguage"
                        render={({ field }) => (
                            <FormItem className="w-[140px] m-0 space-y-0">
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue>
                                                {field.value ? undefined : <span>{t("default_language")}</span>}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                           <SelectItem key={lang.code} value={lang.code}>
                                                {lang.name}
                                           </SelectItem> 
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Active Languages List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <p className="text-sm font-medium text-muted-foreground">{t("active_languages")}</p>
                    </div>

                    <div className="space-y-3">
                        {languages.map((lang, index) => (
                             <div key={lang.code} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">{lang.name} ({lang.code.toUpperCase()})</span>
                                    {lang.code === defaultLang && (
                                        <Badge variant="secondary" className="text-[10px] h-5">{t("default_badge")}</Badge>
                                    )}
                                </div>
                                
                                <FormField
                                    control={control}
                                    name={`localization.languages.${index}.isActive`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={lang.code === defaultLang}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                             </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full border-dashed" disabled>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("add_language")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
