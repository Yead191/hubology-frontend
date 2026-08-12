"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import type { UserSubscription } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { normalizeSubscriptionStatus } from "@/lib/forum";
import {
  cancelSubscription,
  type CancelType,
} from "@/helpers/next-fetch/subscriptionActions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

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
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [cancelType, setCancelType] =
    React.useState<CancelType>("end_of_period");
  const [cancelling, setCancelling] = React.useState(false);

  const status = normalizeSubscriptionStatus(subscription.status);
  const isCancelPending = status === "cancel-pending";
  // Only fully active plans can start a new cancellation.
  const canCancel = Boolean(subscription._id) && status === "active";

  async function handleCancel() {
    if (!subscription._id || cancelling) return;
    setCancelling(true);
    try {
      const res = await cancelSubscription(subscription._id, cancelType);
      if (!res.success) {
        toast.error(res.message || "Could not cancel your subscription.", {
          id: "cancel-sub",
        });
        return;
      }
      toast.success(
        cancelType === "immediate"
          ? "Subscription cancelled immediately."
          : "Subscription will end at the close of your billing period.",
        { id: "cancel-sub" },
      );
      setCancelOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Cancel subscription error:", err);
      toast.error("Network error. Please try again.", { id: "cancel-sub" });
    } finally {
      setCancelling(false);
    }
  }

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
                  ? ` · ${formatPrice(subscription.price)}/${subscription.recuring === "year" ? "year" : "month"}`
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

      <Modal
        open={cancelOpen}
        onClose={cancelling ? () => {} : () => setCancelOpen(false)}
        title="Cancel subscription"
        description="Choose when your plan should end. You’ll keep access until the moment it cancels."
        className="max-w-md"
      >
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setCancelType("end_of_period")}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
              cancelType === "end_of_period"
                ? "border-violet/50 bg-violet/10"
                : "border-hairline bg-white/3 hover:bg-white/5",
            )}
          >
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
              <CalendarClock className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-medium text-cloud">
                End of billing period
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-mist">
                Keep access until {formatDate(subscription.end_date)}. No further
                charges after that.
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCancelType("immediate")}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
              cancelType === "immediate"
                ? "border-rose-400/40 bg-rose-400/10"
                : "border-hairline bg-white/3 hover:bg-white/5",
            )}
          >
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-400/15 text-rose-300">
              <Zap className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-medium text-cloud">
                Cancel immediately
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-mist">
                Access ends right away. Use this if you need to stop the plan
                now.
              </span>
            </span>
          </button>

          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={cancelling}
              onClick={() => setCancelOpen(false)}
            >
              Keep my plan
            </Button>
            <Button
              type="button"
              disabled={cancelling}
              onClick={() => void handleCancel()}
              className={
                cancelType === "immediate"
                  ? "bg-rose-500 hover:bg-rose-500/90"
                  : undefined
              }
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Cancelling…
                </>
              ) : cancelType === "immediate" ? (
                "Cancel now"
              ) : (
                "Cancel at period end"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
