"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "@repo/i18n";
import { FormField, FormItem, FormLabel, FormControl, Input, FormMessage } from "@repo/ui";
import type { SetupFormValues } from "../schema/setup.schema";

export function StepAdminUser() {
  const t = useTranslations("Admin.setup.steps.admin");
  const { control } = useFormContext<SetupFormValues>();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
          )}
        />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}