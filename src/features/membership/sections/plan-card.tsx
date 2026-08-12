"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Loader2, Lock, Sparkles } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import type {
  MembershipPlan,
  TrialEligibility,
  UserSubscription,
} from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { hasActiveSubscription } from "@/lib/forum";
import { subscribeToPlan } from "@/helpers/next-fetch/subscriptionActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

type MembershipAudience = "user" | "vendor";

function hasAccessToken() {
  return Boolean(Cookies.get("accessToken"));
}

function normalizeRole(role?: string | null) {
  return (role ?? Cookies.get("role") ?? "").toLowerCase();
}

function isVendorRole(role?: string | null) {
  const r = normalizeRole(role);
  return r === "vendor" || r === "expert";
}

function resolveStripeUrl(data: unknown): string | undefined {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const candidate =
      d.url ?? d.checkoutUrl ?? d.paymentUrl ?? d.stripeUrl ?? d.sessionUrl;
    if (typeof candidate === "string") return candidate;
  }
  return undefined;
}

/**
 * A single membership tier from the API. Purchase requires login, then
 * calls POST /subscription/subscribe/:planId and redirects to Stripe.
 * Vendors may only buy vendor plans; members may only buy user plans.
 * Trial CTAs appear when the plan has_trial and the user is eligible.
 */
export function PlanCard({
  plan,
  subscription,
  isLoggedIn: isLoggedInProp = false,
  redirectBase = "/membership",
  audience = "user",
  userRole,
  trialEligibility = null,
}: {
  plan: MembershipPlan;
  subscription?: UserSubscription | null;
  isLoggedIn?: boolean;
  /** Base path used after login (member vs vendor membership page). */
  redirectBase?: string;
  audience?: MembershipAudience;
  userRole?: string | null;
  trialEligibility?: TrialEligibility | null;
}) {
  const redirectPath =
    plan.recurring === "year" ? `${redirectBase}?recurring=year` : redirectBase;
  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`;

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [roleGateOpen, setRoleGateOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(isLoggedInProp);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(isLoggedInProp || hasAccessToken());
  }, [isLoggedInProp]);

  const isActive =
    hasActiveSubscription(subscription) &&
    Boolean(subscription?.plan) &&
    subscription!.plan === plan._id;

  const periodLabel = plan.recurring === "year" ? "year" : "month";
  const trialDays = plan.trial_period_days ?? 0;
  const planOffersTrial = Boolean(plan.has_trial) && trialDays > 0;
  // Guests: advertise trial. Logged-in: only if eligibility API says yes and
  // they don't already have an active / cancel-pending subscription.
  const showTrialCta =
    planOffersTrial &&
    !hasActiveSubscription(subscription) &&
    (!isLoggedIn || Boolean(trialEligibility?.isEligible));

  const roleMismatch =
    isLoggedIn &&
    ((audience === "user" && isVendorRole(userRole)) ||
      (audience === "vendor" && !isVendorRole(userRole)));

  const alternateHref =
    audience === "user" ? "/membership/vendor" : "/membership";

  async function handleClick() {
    if (isActive || submitting) return;

    if (!hasAccessToken()) {
      setIsLoggedIn(false);
      setLoginOpen(true);
      return;
    }
    setIsLoggedIn(true);

    // Role gate — vendors can't buy member plans and vice versa.
    if (
      (audience === "user" && isVendorRole(userRole)) ||
      (audience === "vendor" && !isVendorRole(userRole))
    ) {
      setRoleGateOpen(true);
      toast.error(
        audience === "user"
          ? "Vendor accounts can only subscribe to vendor plans."
          : "Member accounts can only subscribe to member plans.",
        { id: "subscribe-role" },
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await subscribeToPlan(plan._id);
      if (!res.success) {
        toast.error(res.message || "Could not start subscription.", {
          id: "subscribe",
        });
        return;
      }

      const paymentUrl = resolveStripeUrl(res.data);
      if (!paymentUrl) {
        toast.error("No payment link returned. Please try again.", {
          id: "subscribe",
        });
        return;
      }

      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Subscribe error:", err);
      toast.error("Network error. Please try again.", { id: "subscribe" });
    } finally {
      setSubmitting(false);
    }
  }

  const ctaLabel = isActive
    ? "Current plan"
    : roleMismatch
      ? audience === "user"
        ? "Vendor plans only"
        : "Member plans only"
      : submitting
        ? "Redirecting…"
        : !isLoggedIn
          ? showTrialCta
            ? "Sign in to start trial"
            : "Sign in to subscribe"
          : showTrialCta
            ? `Start ${trialDays}-day free trial`
            : `Choose ${plan.name}`;

  return (
    <>
      <div
        className={cn(
          "border-gradient group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 ease-out-soft hover:-translate-y-1.5",
          plan.featured
            ? "bg-panel/70 glow-violet"
            : "bg-panel/40 hover:bg-panel/70 hover:glow-violet",
          isActive && "ring-1 ring-violet/50",
          roleMismatch && "opacity-80",
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
        ) : showTrialCta ? (
          <Badge className="absolute -top-3 right-8 border-amber-400/30 bg-amber-400/15 text-amber-300">
            {trialDays}-day free trial
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
          {showTrialCta
            ? `Free for ${trialDays} days, then ${formatPrice(plan.price)}/${periodLabel} · cancel anytime`
            : plan.recurring === "year"
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

        {roleMismatch ? (
          <p className="mt-6 text-xs leading-relaxed text-mist">
            {audience === "user"
              ? "You're signed in as a vendor. Member plans aren't available for your account."
              : "You're signed in as a member. Vendor plans aren't available for your account."}
          </p>
        ) : null}

        <Button
          type="button"
          onClick={() => void handleClick()}
          disabled={isActive || submitting}
          variant={plan.featured ? "default" : "outline"}
          className="mt-8 w-full disabled:opacity-100"
          style={{
            background:
              !isActive && !roleMismatch
                ? "linear-gradient(160deg, #6e22e6 50%, #d65df3 80%)"
                : "",
            border: !isActive && !roleMismatch ? "1px solid #fff" : "",
          }}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {ctaLabel}
            </>
          ) : !isLoggedIn && !isActive ? (
            <>
              <Lock className="h-4 w-4" /> {ctaLabel}
            </>
          ) : roleMismatch ? (
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
        title={showTrialCta ? "Sign in to start your trial" : "Sign in to subscribe"}
        description="Memberships are tied to your Hubology account so your plan and forum access stay in sync."
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <Lock className="h-6 w-6" />
          </span>
          <p className="max-w-xs text-sm text-mist">
            Sign in to{" "}
            {showTrialCta ? "start a free trial of" : "subscribe to"}{" "}
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

      <Modal
        open={roleGateOpen}
        onClose={() => setRoleGateOpen(false)}
        title={
          audience === "user" ? "Vendor accounts only" : "Member accounts only"
        }
        description={
          audience === "user"
            ? "These plans are for members. Switch to vendor membership to subscribe with your vendor account."
            : "These plans are for vendors. Switch to member membership to subscribe with your member account."
        }
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <Lock className="h-6 w-6" />
          </span>
          <p className="max-w-xs text-sm text-mist">
            {audience === "user"
              ? "Go to vendor plans to continue."
              : "Go to member plans to continue."}
          </p>
          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href={alternateHref}>
                {audience === "user"
                  ? "View vendor plans"
                  : "View member plans"}
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRoleGateOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
