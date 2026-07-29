"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { MembershipRecurring } from "@/types";

/** Segmented monthly / yearly switch — drives `?recurring=` on the URL. */
export function BillingToggle({
  value,
  onChange,
}: {
  value: MembershipRecurring;
  onChange: (cycle: MembershipRecurring) => void;
}) {
  const router = useRouter();

  function select(cycle: MembershipRecurring) {
    onChange(cycle);
    // Prefetch the alternate list for snappier switches.
    router.prefetch(
      cycle === "year" ? "/membership?recurring=year" : "/membership",
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-hairline-strong bg-white/3 p-1">
      {(
        [
          { key: "month", label: "Monthly" },
          { key: "year", label: "Yearly" },
        ] as const
      ).map(({ key, label }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => select(key)}
            aria-pressed={active}
            className={cn(
              "relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand-gradient text-white shadow-[0_8px_22px_-10px_rgba(129,49,240,0.9)]"
                : "text-mist hover:text-cloud",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
