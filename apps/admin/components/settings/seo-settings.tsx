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
  Textarea, 
  FormMessage,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui";
import { toast } from "sonner";
import { SettingsSchema, type SettingsFormValues } from "./settings.schema";

export function SEOSettingsForm({ initialData, locale, id }: { initialData: any, locale: string, id?: string }) {
  const t = useTranslations("Admin.settings");
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(SettingsSchema.pick({ seo: true })),
    defaultValues: initialData,
  });

  const { handleSubmit, formState: { isDirty }, reset } = form;

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      console.log("Saving SEO settings:", data);
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
                <CardTitle>{t("seo.general.title")}</CardTitle>
                <CardDescription>{t("seo.general.description")}</CardDescription>
                </CardHeader>
                <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="seo.metaTitleTemplate.en"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t("seo.fields.titleTemplate")} (English)</FormLabel>
                        <FormControl><Input {...field} placeholder="%s | Store Name" /></FormControl>
                        <p className="text-[10px] text-muted-foreground mt-1">Use %s for page title</p>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="seo.metaTitleTemplate.ar"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t("seo.fields.titleTemplate")} (العربية)</FormLabel>
                        <FormControl><Input {...field} placeholder="%s | اسم المتجر" /></FormControl>
                        <p className="text-[10px] text-muted-foreground mt-1">استخدم %s لعنوان الصفحة</p>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="seo.metaDescriptionDefault.en"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t("seo.fields.defaultDesc")} (English)</FormLabel>
                        <FormControl><Textarea {...field} className="min-h-[100px] resize-none" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="seo.metaDescriptionDefault.ar"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t("seo.fields.defaultDesc")} (العربية)</FormLabel>
                        <FormControl><Textarea {...field} className="min-h-[100px] resize-none" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                </div>
            </section>

            <section className="p-6 border rounded-lg bg-muted/20">
                <CardHeader className="px-0 py-0 mb-4">
                <CardTitle className="text-sm font-semibold">{t("seo.preview.title")}</CardTitle>
                </CardHeader>
                <div className="space-y-1.5 font-sans">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white rounded-full border flex items-center justify-center text-[10px] shadow-sm">G</div>
                    <div className="flex flex-col">
                    <span className="text-xs text-[#202124]">Google</span>
                    <span className="text-[10px] text-[#70757a]">https://store.com › ...</span>
                    </div>
                </div>
                <h3 className="text-[#1a0dab] text-xl font-normal hover:underline cursor-pointer leading-tight">
                    {t("seo.preview.exampleTitle")}
                </h3>
                <p className="text-[#4d5156] text-sm leading-snug line-clamp-2">
                    {t("seo.preview.exampleDesc")}
                </p>
                </div>
            </section>
        </div>
      </form>
    </Form>
  );
}
