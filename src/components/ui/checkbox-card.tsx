"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Selectable tile with a checkbox affordance — used for multi-select
 * grids (expertise, consultation types). Controlled via `checked`.
 */
export function CheckboxCard({
  checked,
  onToggle,
  label,
  className,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/25",
        checked
          ? "border-violet/50 bg-violet/10 text-cloud"
          : "border-hairline-strong bg-white/[0.02] text-mist hover:bg-white/[0.05] hover:text-cloud",
        className,
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
          checked
            ? "border-transparent bg-brand-gradient text-white"
            : "border-hairline-strong",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
