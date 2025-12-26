"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "@repo/i18n";
import { FormField, FormItem, FormLabel, FormControl, Input, Textarea, FormMessage } from "@repo/ui";
import type { SetupFormValues } from "../schema/setup.schema";

export function StepStoreInfo() {
  const t = useTranslations("Admin.setup.steps.store");
  const { control } = useFormContext<SetupFormValues>();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <FormField
        control={control}
        name="storeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("storeName")}</FormLabel>
            <FormControl>
              <Input placeholder={t("placeholders.name")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="storeDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("description")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("placeholders.description")} className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}