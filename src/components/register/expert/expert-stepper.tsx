"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepMeta {
  id: string;
  label: string;
}

/** Horizontal progress indicator for the expert application wizard. */
export function ExpertStepper({
  steps,
  current,
}: {
  steps: StepMeta[];
  current: number;
}) {
  return (
    <ol className="flex items-center">
      {steps.map((step, i) => {
        const isComplete = i < current;
        const isActive = i === current;
        const isLast = i === steps.length - 1;

        return (
          <li
            key={step.id}
            className={cn("flex items-center", !isLast && "flex-1")}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-all duration-300",
                  isComplete && "border-transparent bg-brand-gradient text-white",
                  isActive &&
                    "border-violet/60 bg-violet/15 text-cloud ring-4 ring-violet/10",
                  !isComplete && !isActive &&
                    "border-hairline-strong bg-white/[0.02] text-faint",
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium transition-colors sm:block",
                  isActive || isComplete ? "text-cloud" : "text-faint",
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "mx-3 h-px flex-1 transition-colors duration-300",
                  isComplete ? "bg-violet/60" : "bg-hairline-strong",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
