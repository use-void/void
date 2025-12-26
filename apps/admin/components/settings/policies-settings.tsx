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
  Textarea, 
  FormMessage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SettingsSchema, type SettingsFormValues } from "./settings.schema";

const POLICY_FIELDS = [
  { id: "termsAndConditions", labelKey: "terms" },
  { id: "privacyPolicy", labelKey: "privacy" },
  { id: "refundPolicy", labelKey: "refund" },
  { id: "shippingPolicy", labelKey: "shipping" },
];

export function PoliciesSettingsForm({ initialData, locale, id }: { initialData: any, locale: string, id?: string }) {
  const t = useTranslations("Admin.settings");
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(SettingsSchema.pick({ policies: true })),
    defaultValues: initialData,
  });

  const { handleSubmit, formState: { isDirty }, reset } = form;

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      console.log("Saving policies settings:", data);
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
            <CardHeader className="px-0 pt-0 pb-0">
                <CardTitle>{t("policies.title")}</CardTitle>
                <CardDescription>{t("policies.description")}</CardDescription>
            </CardHeader>

            <Tabs defaultValue="termsAndConditions" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/20 border rounded-lg">
                {POLICY_FIELDS.map((policy) => (
                    <TabsTrigger
                    key={policy.id}
                    value={policy.id}
                    className="py-2 px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                    <span className="text-xs font-medium">{t(`policies.fields.${policy.labelKey}`)}</span>
                    </TabsTrigger>
                ))}
                </TabsList>

                {POLICY_FIELDS.map((policy) => (
                <TabsContent key={policy.id} value={policy.id} className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name={`policies.${policy.id}.en`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t(`policies.fields.${policy.labelKey}`)} (English)</FormLabel>
                            <FormControl>
                            <Textarea 
                                {...field} 
                                placeholder={t("policies.placeholders.writePolicy")} 
                                className="min-h-[500px] resize-none font-sans leading-relaxed" 
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`policies.${policy.id}.ar`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t(`policies.fields.${policy.labelKey}`)} (العربية)</FormLabel>
                            <FormControl>
                            <Textarea 
                                {...field} 
                                placeholder={t("policies.placeholders.writePolicy")} 
                                className="min-h-[500px] resize-none font-sans leading-relaxed text-right font-arabic" 
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                </TabsContent>
                ))}
            </Tabs>
        </div>
      </form>
    </Form>
  );
}
