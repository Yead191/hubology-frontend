"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Lock, Sparkles } from "lucide-react";
import Cookies from "js-cookie";

import type { MembershipPlan, UserSubscription } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

function hasAccessToken() {
  return Boolean(Cookies.get("accessToken"));
}

/**
 * A single membership tier from the API. Purchase requires login, then
 * redirects to the plan's Stripe `paymentUrl`.
 */
export function PlanCard({
  plan,
  subscription,
  isLoggedIn: isLoggedInProp = false,
}: {
  plan: MembershipPlan;
  subscription?: UserSubscription | null;
  isLoggedIn?: boolean;
}) {
  const redirectPath =
    plan.recurring === "year"
      ? "/membership?recurring=year"
      : "/membership";
  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`;

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(isLoggedInProp);

  React.useEffect(() => {
    setIsLoggedIn(isLoggedInProp || hasAccessToken());
  }, [isLoggedInProp]);

  const isActive =
    Boolean(subscription?.name) &&
    subscription!.name.toLowerCase() === plan.name.toLowerCase();

  const periodLabel = plan.recurring === "year" ? "year" : "month";

  function handleClick() {
    if (isActive) return;

    if (!hasAccessToken()) {
      setIsLoggedIn(false);
      setLoginOpen(true);
      return;
    }
    setIsLoggedIn(true);

    if (!plan.paymentUrl) return;
    window.location.href = plan.paymentUrl;
  }

  const ctaLabel = isActive
    ? "Current plan"
    : isLoggedIn
      ? `Choose ${plan.name}`
      : "Sign in to subscribe";

  return (
    <>
      <div
        className={cn(
          "border-gradient group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 ease-out-soft hover:-translate-y-1.5",
          plan.featured
            ? "bg-panel/70 glow-violet"
            : "bg-panel/40 hover:bg-panel/70 hover:glow-violet",
          isActive && "ring-1 ring-violet/50",
        )}
      >
        {plan.highlight ? (
          <Badge variant="solid" className="absolute -top-3 left-8">
            <Sparkles className="h-3 w-3" />
            {plan.highlight}
          </Badge>
        ) : null}
        {isActive ? (
          <Badge className="absolute -top-3 right-8 border-emerald-400/30 bg-emerald-400/15 text-emerald-300">
            Active
          </Badge>
        ) : null}

        <header className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold uppercase tracking-wide text-cloud">
            {plan.name}
          </h3>
          <p className="text-sm text-mist">{plan.tagline}</p>
        </header>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="font-display text-4xl font-bold text-cloud">
            {formatPrice(plan.price)}
          </span>
          <span className="text-sm text-mist">/ {periodLabel}</span>
        </div>
        <p className="mt-1 text-xs text-faint">
          {plan.recurring === "year"
            ? "Billed yearly · cancel anytime"
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
          type="button"
          onClick={handleClick}
          disabled={isActive || (!plan.paymentUrl && isLoggedIn)}
          variant={plan.featured ? "default" : "outline"}
          className="mt-8 w-full disabled:opacity-100"
          style={{
            background:
              plan.featured && !isActive
                ? "linear-gradient(160deg, #6e22e6 50%, #d65df3 80%)"
                : "",
            border: plan.featured && !isActive ? "1px solid #fff" : "",
          }}
        >
          {!isLoggedIn && !isActive ? (
            <>
              <Lock className="h-4 w-4" /> {ctaLabel}
            </>
          ) : (
            ctaLabel
          )}
        </Button>
      </div>

      <Modal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        title="Sign in to subscribe"
        description="Memberships are tied to your Hubology account so your plan and forum access stay in sync."
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <Lock className="h-6 w-6" />
          </span>
          <p className="max-w-xs text-sm text-mist">
            Sign in to subscribe to{" "}
            <span className="text-cloud">{plan.name}</span>.
          </p>
          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href={loginHref}>Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/join">Create an account</Link>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
