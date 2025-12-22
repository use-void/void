"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { FormControl, FormField, FormItem } from "@repo/ui";
import { Input } from "@repo/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { StoreConfigFormValues } from "@/lib/schemas/store-config.schema";

export function CurrenciesCard() {
    const t = useTranslations("Admin.settings.localization.currencies");
    const { control, watch } = useFormContext<StoreConfigFormValues>();

    const currencies = watch("financials.currencies") || [];
    const defaultCurrency = watch("financials.defaultCurrency");

    // Placeholder for indicator colors
    const colors = ["bg-emerald-500", "bg-blue-500", "bg-orange-500"];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Base Currency */}
                 <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Coins className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{t("base_currency")}</p>
                            <p className="text-xs text-muted-foreground">{t("base_currency_desc")}</p>
                        </div>
                    </div>
                    <FormField
                        control={control}
                        name="financials.defaultCurrency"
                        render={({ field }) => (
                            <FormItem className="w-[120px] m-0 space-y-0">
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue>
                                                {field.value ? undefined : <span>Select</span>}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {currencies.map((curr) => (
                                           <SelectItem key={curr.code} value={curr.code}>
                                                {curr.code} ({curr.symbol?.en as string})
                                           </SelectItem> 
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Exchange Rates */}
                <div className="space-y-4">
                     <p className="text-sm font-medium text-muted-foreground">{t("exchange_rates")}</p>
                     
                     <div className="space-y-3">
                        {currencies.map((curr, index) => (
                            <div key={curr.code} className="flex items-center gap-4">
                                <div className="w-16 font-medium text-sm flex items-center gap-2">
                                     {curr.code}
                                </div>
                                <FormField
                                    control={control}
                                    name={`financials.currencies.${index}.exchangeRate`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <FormControl>
                                                <div className="relative">
                                                     <Input 
                                                        type="number" 
                                                        {...field} 
                                                        disabled={curr.code === defaultCurrency} // Base currency is always 1
                                                        step="0.01"
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                     />
                                                     <div className={`absolute right-3 top-3 h-2 w-2 rounded-full ${colors[index % colors.length]}`} />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                     </div>
                </div>

            </CardContent>
        </Card>
    );
}
