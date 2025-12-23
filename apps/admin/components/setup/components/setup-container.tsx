"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "@repo/i18n";
import { Form, Button } from "@repo/ui";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

import { useSetupForm } from "../hooks/use-setup-form";
import { submitSetupAction } from "../actions/submit-setup.action";
import type { SetupFormValues } from "../schema/setup.schema";
import { SuccessView } from "./success-view";
import { StepStoreInfo, StepLocation, StepAdminUser, StepSeeding } from "../steps";

const STEPS = [
  { id: 1, component: StepStoreInfo, key: "store", fields: ["storeName", "storeDescription"] },
  { id: 2, component: StepLocation, key: "location", fields: ["country", "city", "address", "currency", "timezone"] },
  { id: 3, component: StepAdminUser, key: "admin", fields: ["firstName", "lastName", "email", "password", "confirmPassword"] },
  { id: 4, component: StepSeeding, key: "seeding", fields: ["shouldSeed"] },
];

export function SetupContainer() {
  const t = useTranslations("Admin.setup");
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  
  const form = useSetupForm(t);
  const currentStepConfig = STEPS[step - 1];

  const handleNext = async () => {
    // @ts-ignore
    const isValid = await form.trigger(currentStepConfig.fields);
    if (isValid) {
      setStep((s) => Math.min(s + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const onCompleteSetup = (data: SetupFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const res = await submitSetupAction(data);
      if (res.success && res.redirectUrl) {
        setSuccessUrl(res.redirectUrl);
      } else {
        if (res.errors) {
            Object.entries(res.errors).forEach(([key, msgs]) => {
                form.setError(key as any, { message: msgs[0] });
            });
        }
        if (res.message) {
            setServerError(res.message.includes(".") ? t(res.message) : res.message);
        }
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        if (step < STEPS.length) {
            handleNext();
        } 
    }
  };

  if (!currentStepConfig) return null;
  const CurrentComponent = currentStepConfig.component;

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      
      {/* 
        ✅ التعديل الجذري: نقلنا قسم الفورم ليكون هو "الأول" في الكود
        النتيجة: 
        - LTR: يظهر يساراً (بداية الصفحة)
        - RTL: يظهر يميناً (بداية الصفحة العربية)
      */}
      <div className="flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:px-24 xl:px-32">
        <div className="w-full max-w-lg mx-auto">
            
            {successUrl ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <SuccessView redirectUrl={successUrl} />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                             <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
                                {t("step", { defaultMessage: "Step" })} {step} / {STEPS.length}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                                {Math.round((step / STEPS.length) * 100)}%
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                            <div 
                                className="h-full bg-primary transition-all duration-500 ease-out" 
                                style={{ width: `${(step / STEPS.length) * 100}%` }}
                            />
                        </div>
                        
                        <h1 className="text-3xl font-semibold tracking-tight pt-4">
                            {t(`steps.${currentStepConfig.key}.title`)}
                        </h1>
                    </div>

                    <Form {...form}>
                        {/* ✅ الفورم الآمن (بدون onSubmit) */}
                        <form 
                            onKeyDown={handleKeyDown}
                            className="space-y-8"
                        >
                            <div className="min-h-[220px] py-2">
                                <CurrentComponent />
                            </div>

                            {serverError && (
                                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center">
                                    {serverError}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex items-center justify-between pt-8 border-t border-border/50">
                                <Button
                                    type="button" 
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={step === 1 || isPending}
                                    className="border-border hover:bg-muted"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t("buttons.back")}
                                </Button>

                                {step < STEPS.length ? (
                                    <Button 
                                        type="button" 
                                        onClick={handleNext}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        {t("buttons.next")}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    // ✅ زر الحفظ اليدوي الآمن
                                    <Button 
                                        type="button"
                                        onClick={form.handleSubmit(onCompleteSetup)}
                                        disabled={isPending}
                                        className="min-w-[160px] shadow-lg shadow-primary/20"
                                    >
                                        {isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                {t("buttons.complete")}
                                                <CheckCircle2 className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
      </div>

      {/* 
        ✅ القسم الجمالي: أصبح هو "الثاني" في الكود
        النتيجة: 
        - LTR: يظهر يميناً
        - RTL: يظهر يساراً
      */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/30 via-zinc-950 to-zinc-950 pointer-events-none" />
        
        <div className="relative z-10 font-bold text-2xl tracking-tighter">
            VOID COMMERCE
        </div>
        <div className="relative z-10 space-y-4 max-w-md">
            <h2 className="text-4xl font-light tracking-tight leading-tight">
                {t("sidePanel.title")}
            </h2>
            <p className="text-zinc-400 text-lg font-light">
                {t("sidePanel.description")}
            </p>
        </div>
        <div className="relative z-10 text-xs text-zinc-600 font-mono">
            {t("sidePanel.footer")}
        </div>
      </div>

    </div>
  );
}