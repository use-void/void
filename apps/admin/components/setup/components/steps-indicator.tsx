"use client";

import { Check } from "lucide-react";

export function StepsIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="relative flex justify-between items-center mb-8 px-2">
      <div className="absolute left-0 top-1/2 w-full h-px bg-muted -z-10" />
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = currentStep >= stepNum;
        const isCompleted = currentStep > stepNum;

        return (
          <div
            key={stepNum}
            className={`
              flex items-center justify-center w-8 h-8  border text-sm font-medium transition-all duration-300
              ${isActive
                ? "bg-primary border-primary text-primary-foreground  shadow-primary/20"
                : "bg-background border-muted-foreground/30 text-muted-foreground"
              }
            `}
          >
            {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
          </div>
        );
      })}
    </div>
  );
}