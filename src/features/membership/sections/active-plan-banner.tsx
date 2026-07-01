"use client";

import Link from "next/link";
import { BadgeCheck, ArrowRight } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMembership } from "@/features/membership/membership-context";

/**
 * Shown at the top of the membership page once the viewer is subscribed:
 * confirms their plan, links into the forum, and allows cancelling.
 */
export function ActivePlanBanner() {
  const { activePlan, billingCycle, cancel } = useMembership();
  if (!activePlan) return null;

  const price =
    billingCycle === "yearly"
      ? activePlan.priceYearly
      : activePlan.priceMonthly;

  return (
    <div className="border-gradient glow-violet flex flex-col gap-4 rounded-3xl bg-panel/70 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
          <BadgeCheck className="h-6 w-6" />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-cloud">
            You&apos;re on the {activePlan.name} plan
          </p>
          <p className="text-sm text-mist">
            {formatPrice(price, activePlan.currency)}/month · full community
            forum access unlocked
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/forum">
            Enter the forum
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" onClick={cancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
