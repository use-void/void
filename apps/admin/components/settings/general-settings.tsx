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
  Separator,
} from "@repo/ui";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SettingsSchema, type SettingsFormValues } from "./settings.schema";

interface GeneralSettingsFormProps {
  initialData: SettingsFormValues["name"] extends any ? any : any; // Temporary fix for type
  locale: string;
}

export function GeneralSettingsForm({ initialData, locale, id }: { initialData: any, locale: string, id?: string }) {
  const t = useTranslations("Admin.settings");
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(SettingsSchema.pick({ name: true, slogan: true, description: true, assets: true })),
    defaultValues: initialData,
  });

  const { handleSubmit, formState: { isDirty }, reset } = form;

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      console.log("Saving general settings:", data);
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
                <CardTitle>{t("general.basicInfo.title")}</CardTitle>
                <CardDescription>{t("general.basicInfo.description")}</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="name.en"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("general.fields.name")} (English)</FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="Store Name" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name.ar"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("general.fields.name")} (العربية)</FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="اسم المتجر" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="md:col-span-2">
                    <FormField
                    control={form.control}
                    name="slogan.en"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t("general.fields.slogan")} (English)</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Store Slogan" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="md:col-span-2">
                    <FormField
                    control={form.control}
                    name="description.en"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t("general.fields.description")} (English)</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="Simple store description..." className="min-h-[100px] resize-none" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                </div>
            </section>

            <Separator />

            <section className="space-y-6">
                <CardHeader className="px-0 py-0">
                <CardTitle className="text-lg">{t("general.assets.title")}</CardTitle>
                <CardDescription>{t("general.assets.description")}</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AssetUploadField control={form.control} name="assets.logoPrimary" label={t("general.fields.logoPrimary")} description={t("general.fields.logoPrimaryDesc")} />
                <AssetUploadField control={form.control} name="assets.logoSecondary" label={t("general.fields.logoSecondary")} description={t("general.fields.logoSecondaryDesc")} />
                <AssetUploadField control={form.control} name="assets.favicon" label={t("general.fields.favicon")} description={t("general.fields.faviconDesc")} />
                </div>
            </section>
        </div>
      </form>
    </Form>
  );
}

function AssetUploadField({ control, name, label, description }: { control: any; name: string; label: string; description: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer bg-muted/20">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Upload File</span>
              <p className="text-[10px] text-center text-muted-foreground/70">{description}</p>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
