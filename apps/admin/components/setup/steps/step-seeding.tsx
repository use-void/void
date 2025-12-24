"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "@repo/i18n";
import { 
  FormField, 
  FormItem, 
  FormControl, 
  FormLabel,
  FormDescription,
  Checkbox,
  FormMessage
} from "@repo/ui";
import { Database } from "lucide-react";
import type { SetupFormValues } from "../schema/setup.schema";

export function StepSeeding() {
  const t = useTranslations("Admin.setup.steps.seeding");
  const { control } = useFormContext<SetupFormValues>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* نص تعريفي بسيط */}
      <div>
        <h3 className="text-lg font-medium">
            {t("title", { defaultMessage: "Data Initialization" })}
        </h3>
        <p className="text-sm text-muted-foreground">
            {t("description", { defaultMessage: "Would you like to populate your store with sample data?" })}
        </p>
      </div>

      <FormField
        control={control}
        name="shouldSeed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0  border p-4  bg-card">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="cursor-pointer flex items-center gap-2">
                 <Database className="w-4 h-4 text-primary" />
                 {t("seedLabel", { defaultMessage: "Install Demo Data" })}
              </FormLabel>
              <FormDescription>
                {t("seedHint", { defaultMessage: "Add sample products, categories, and customers to test the store." })}
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* رسالة توضيحية تظهر فقط عند التفعيل لإعلام المستخدم */}
      {control._formValues.shouldSeed && (
        <div className=" bg-primary/5 border border-primary/10 p-4 text-sm text-primary animate-in slide-in-from-top-2 fade-in">
          <p className="flex items-center gap-2">
            <strong>{t("note")}</strong> 
            {t("noteDescription")}
          </p>
        </div>
      )}
    </div>
  );
}