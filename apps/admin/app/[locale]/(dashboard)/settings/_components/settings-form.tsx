"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@repo/ui";
import { Form } from "@repo/ui";
import { updateStoreConfig } from "@/lib/actions/store-config.actions";
import { StoreConfigFormValues, StoreConfigSchema } from "@/lib/schemas/store-config.schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SettingsNav } from "./settings-nav";
import { GeneralView } from "./views/general-view";
import { LocalizationView } from "./views/localization-view";

interface SettingsFormProps {
    initialData: StoreConfigFormValues;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const t = useTranslations("Admin.settings");
    const [isPending, setIsPending] = useState(false);

    const [activeTab, setActiveTab] = useState("general");

    const form = useForm<StoreConfigFormValues>({
        resolver: zodResolver(StoreConfigSchema) as any,
        defaultValues: initialData,
    });

    async function onSubmit(data: StoreConfigFormValues) {
        setIsPending(true);
        try {
            const result = await updateStoreConfig(data);
            if (result.success) {
                toast.success(t("success_message"));
            } else {
                toast.error(result.error || t("error_message"));
            }
        } catch (error) {
            toast.error(t("error_message"));
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                    <div className="lg:col-span-1">
                        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        {activeTab === "general" && <GeneralView />}
                        {activeTab === "localization" && <LocalizationView />}
                        
                        {/* Placeholders for other tabs */}
                        {activeTab !== "general" && activeTab !== "localization" && (
                             <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">Work in progress: {activeTab}</p>
                             </div>
                        )}

                        <div className="flex justify-end pt-6 border-t">
                            <Button type="submit" disabled={isPending} size="lg">
                                {isPending ? t("actions.saving") : t("actions.save_changes")}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
