"use client";

import { cn } from "@/lib/utils";
import type { BillingCycle } from "@/types";

/** Segmented monthly / yearly switch with a savings hint. */
export function BillingToggle({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-hairline-strong bg-white/[0.03] p-1">
      {(["monthly", "yearly"] as const).map((cycle) => {
        const active = value === cycle;
        return (
          <button
            key={cycle}
            type="button"
            onClick={() => onChange(cycle)}
            aria-pressed={active}
            className={cn(
              "relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand-gradient text-white shadow-[0_8px_22px_-10px_rgba(129,49,240,0.9)]"
                : "text-mist hover:text-cloud",
            )}
          >
            {cycle === "monthly" ? "Monthly" : "Yearly"}
            {cycle === "yearly" && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-emerald-400/15 text-emerald-300",
                )}
              >
                Save 20%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
