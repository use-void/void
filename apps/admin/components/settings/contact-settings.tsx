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
  CardHeader,
  CardTitle,
  CardDescription,
  Separator,
} from "@repo/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SettingsSchema, type SettingsFormValues } from "./settings.schema";

export function ContactSettingsForm({ initialData, locale, id }: { initialData: any, locale: string, id?: string }) {
  const t = useTranslations("Admin.settings");
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(SettingsSchema.pick({ contact: true })),
    defaultValues: initialData,
  });

  const { handleSubmit, formState: { isDirty }, reset } = form;

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      console.log("Saving contact settings:", data);
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
                <CardTitle>{t("contact.support.title")}</CardTitle>
                <CardDescription>{t("contact.support.description")}</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                    control={form.control}
                    name="contact.supportEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("contact.fields.supportEmail")}</FormLabel>
                        <FormControl><Input {...field} placeholder="support@store.com" /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact.supportPhone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("contact.fields.supportPhone")}</FormLabel>
                        <FormControl><Input {...field} placeholder="+966..." /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact.whatsappNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("contact.fields.whatsapp")}</FormLabel>
                        <FormControl><Input {...field} placeholder="+966..." /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
            </section>

            <Separator />

            <section className="space-y-6">
                <CardHeader className="px-0 py-0">
                <CardTitle className="text-lg">{t("contact.address.title")}</CardTitle>
                <CardDescription>{t("contact.address.description")}</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="contact.address.en"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("contact.fields.address")} (English)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact.address.ar"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("contact.fields.address")} (العربية)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
            </section>

            <Separator />

            <section className="space-y-6">
                <CardHeader className="px-0 py-0">
                <CardTitle className="text-lg">{t("contact.social.title")}</CardTitle>
                <CardDescription>{t("contact.social.description")}</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="contact.socialLinks.instagram"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl><Input {...field} placeholder="https://instagram.com/..." /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact.socialLinks.twitter"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>X (Twitter)</FormLabel>
                        <FormControl><Input {...field} placeholder="https://x.com/..." /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact.socialLinks.facebook"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl><Input {...field} placeholder="https://facebook.com/..." /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
            </section>
        </div>
      </form>
    </Form>
  );
}
