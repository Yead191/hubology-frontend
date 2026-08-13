"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";

import type { UserSubscription } from "@/types";
import { formatPrice } from "@/lib/utils";
import { normalizeSubscriptionStatus } from "@/lib/forum";
import { recurringPeriodLabel } from "@/lib/membership";
import { Button } from "@/components/ui/button";
import { CancelSubscriptionModal } from "@/features/membership/sections/cancel-subscription-modal";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/**
 * Shown at the top of the membership page once the viewer has an active
 * subscription on their profile — includes cancel (immediate / end of period).
 */
export function ActivePlanBanner({
  subscription,
}: {
  subscription: UserSubscription;
}) {
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const status = normalizeSubscriptionStatus(subscription.status);
  const isCancelPending = status === "cancel-pending";
  const canCancel = Boolean(subscription._id) && status === "active";
  const period = recurringPeriodLabel(subscription.recuring);

  return (
    <>
      <div className="border-gradient glow-violet flex flex-col gap-5 rounded-3xl bg-panel/70 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
              <BadgeCheck className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg font-semibold text-cloud">
                  You&apos;re on the {subscription.name} plan
                </p>
                {subscription.is_trial ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                    <Sparkles className="h-3 w-3" />
                    Trial
                  </span>
                ) : null}
                {isCancelPending ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                    Ends {formatDate(subscription.end_date)}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-sm text-mist">
                {isCancelPending
                  ? `Cancellation scheduled · access through ${formatDate(subscription.end_date)}`
                  : subscription.is_trial
                    ? `Trial active through ${formatDate(subscription.end_date)}`
                    : `Active through ${formatDate(subscription.end_date)}`}
                {subscription.price != null
                  ? ` · ${formatPrice(subscription.price)}/${period}`
                  : ""}
                {subscription.auto_renew != null
                  ? ` · Auto-renew ${subscription.auto_renew ? "on" : "off"}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild>
              <Link href="/forum">
                Enter the forum
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {canCancel ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelOpen(true)}
              >
                Cancel plan
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <CancelSubscriptionModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        subscriptionId={subscription._id}
        endDate={subscription.end_date}
        planName={subscription.name}
      />
    </>
  );
}
