"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@repo/i18n";
import { 
  Form,
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  Input, 
  FormMessage,
  Switch,
  CardHeader,
  CardTitle,
  CardDescription,
  Separator,
} from "@repo/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SettingsSchema, type SettingsFormValues } from "./settings.schema";

export function ShopSettingsForm({ initialData, locale, id }: { initialData: any, locale: string, id?: string }) {
  const t = useTranslations("Admin.settings");
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(SettingsSchema.pick({ shopSettings: true })),
    defaultValues: initialData,
  });

  const { handleSubmit, formState: { isDirty }, reset } = form;

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      console.log("Saving shop settings:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("notifications.saveSuccess"));
      form.reset(data);
    } catch (error) {
      toast.error(t("notifications.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        id={id}
        onSubmit={handleSubmit(onSubmit)} 
        onReset={(e) => {
           e.preventDefault();
           reset();
        }}
        className="flex flex-col w-full"
      >
        <div className="w-full space-y-12">
            <section className="space-y-6">
                <CardHeader className="px-0 pt-0">
                <CardTitle>{t("shop.maintenance.title")}</CardTitle>
                <CardDescription>{t("shop.maintenance.description")}</CardDescription>
                </CardHeader>
                <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="shopSettings.isMaintenanceMode"
                    render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="space-y-0.5">
                        <FormLabel className="text-base">{t("shop.fields.maintenanceMode")}</FormLabel>
                        <p className="text-xs text-muted-foreground">{t("shop.fields.maintenanceModeDesc")}</p>
                        </div>
                        <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                </div>
            </section>

            <Separator />

            <section className="space-y-6">
                <CardHeader className="px-0 py-0">
                <CardTitle className="text-lg">{t("shop.checkout.title")}</CardTitle>
                <CardDescription>{t("shop.checkout.description")}</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="shopSettings.isGuestCheckoutEnabled"
                    render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/5 transition-colors">
                        <div className="space-y-0.5">
                        <FormLabel>{t("shop.fields.guestCheckout")}</FormLabel>
                        <p className="text-xs text-muted-foreground">{t("shop.fields.guestCheckoutDesc")}</p>
                        </div>
                        <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shopSettings.isInventoryTrackingEnabled"
                    render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/5 transition-colors">
                        <div className="space-y-0.5">
                        <FormLabel>{t("shop.fields.inventoryTracking")}</FormLabel>
                        <p className="text-xs text-muted-foreground">{t("shop.fields.inventoryTrackingDesc")}</p>
                        </div>
                        <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                </div>
            </section>

            <Separator />

            <section className="space-y-6">
                <CardHeader className="px-0 py-0">
                <CardTitle className="text-lg">{t("shop.announcement.title")}</CardTitle>
                <CardDescription>{t("shop.announcement.description")}</CardDescription>
                </CardHeader>
                <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="shopSettings.announcementBar.isEnabled"
                    render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/5 transition-colors">
                        <FormLabel className="text-base">{t("shop.fields.enableAnnouncement")}</FormLabel>
                        <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="shopSettings.announcementBar.text.en"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t("shop.fields.announcementText")} (English)</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="shopSettings.announcementBar.text.ar"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t("shop.fields.announcementText")} (العربية)</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                </div>
            </section>
        </div>
      </form>
    </Form>
  );
}
