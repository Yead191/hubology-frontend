"use client";

import { Check, Sparkles } from "lucide-react";

import type { MembershipPlan } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMembership } from "@/features/membership/membership-context";

/**
 * A single membership tier. Price reflects the active billing cycle and
 * the CTA is fully functional: subscribe, switch, or "current plan".
 */
export function PlanCard({
  plan,
  onSubscribe,
}: {
  plan: MembershipPlan;
  /** Called after subscribing — e.g. to surface a success state. */
  onSubscribe?: (planId: string) => void;
}) {
  const { billingCycle, activePlan, subscribe } = useMembership();

  const isActive = activePlan?.id === plan.id;
  const hasOtherPlan = activePlan !== null && !isActive;
  const price =
    billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;

  const handleClick = () => {
    subscribe(plan.id);
    onSubscribe?.(plan.id);
  };

  const ctaLabel = isActive
    ? "Current plan"
    : hasOtherPlan
      ? `Switch to ${plan.name}`
      : `Choose ${plan.name}`;

  return (
    <div
      className={cn(
        "border-gradient group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 ease-out-soft hover:-translate-y-1.5",
        plan.featured
          ? "bg-panel/70 glow-violet"
          : "bg-panel/40 hover:bg-panel/70 hover:glow-violet",
        isActive && "ring-1 ring-violet/50",
      )}
    >
      {plan.highlight && (
        <Badge variant="solid" className="absolute -top-3 left-8">
          <Sparkles className="h-3 w-3" />
          {plan.highlight}
        </Badge>
      )}
      {isActive && (
        <Badge className="absolute -top-3 right-8 border-emerald-400/30 bg-emerald-400/15 text-emerald-300">
          Active
        </Badge>
      )}

      <header className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold uppercase tracking-wide text-cloud">
          {plan.name}
        </h3>
        <p className="text-sm text-mist">{plan.tagline}</p>
      </header>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-cloud">
          {formatPrice(price, plan.currency)}
        </span>
        <span className="text-sm text-mist">/ month</span>
      </div>
      <p className="mt-1 text-xs text-faint">
        {billingCycle === "yearly"
          ? `Billed yearly — ${formatPrice(price * 12, plan.currency)}/yr`
          : "Billed monthly · cancel anytime"}
      </p>

      <ul className="mt-7 flex flex-1 flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-cloud/85"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-bright">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={handleClick}
        disabled={isActive}
        variant={plan.featured ? "default" : "outline"}
        className="mt-8 w-full disabled:opacity-100"
        style={{
          background: plan.featured && !isActive
            ? "linear-gradient(160deg, #6e22e6 50%, #d65df3 80%)"
            : "",
          border: plan.featured && !isActive ? "1px solid #fff" : "",
        }}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
