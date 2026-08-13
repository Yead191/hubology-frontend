"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  cancelSubscription,
  type CancelType,
} from "@/helpers/next-fetch/subscriptionActions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

function formatDate(iso?: string) {
  if (!iso) return "the end of your billing period";
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

/** Shared cancel flow: immediate vs end of period. */
export function CancelSubscriptionModal({
  open,
  onClose,
  subscriptionId,
  endDate,
  planName,
}: {
  open: boolean;
  onClose: () => void;
  subscriptionId: string;
  endDate?: string;
  planName?: string;
}) {
  const router = useRouter();
  const [cancelType, setCancelType] =
    React.useState<CancelType>("end_of_period");
  const [cancelling, setCancelling] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setCancelType("end_of_period");
      setCancelling(false);
    }
  }, [open]);

  async function handleCancel() {
    if (!subscriptionId || cancelling) return;
    setCancelling(true);
    try {
      const res = await cancelSubscription(subscriptionId, cancelType);
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
      onClose();
      router.refresh();
    } catch (err) {
      console.error("Cancel subscription error:", err);
      toast.error("Network error. Please try again.", { id: "cancel-sub" });
    } finally {
      setCancelling(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={cancelling ? () => {} : onClose}
      title="Cancel subscription"
      description={
        planName
          ? `Choose when ${planName} should end. You’ll keep access until the moment it cancels.`
          : "Choose when your plan should end. You’ll keep access until the moment it cancels."
      }
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
              Keep access until {formatDate(endDate)}. No further charges after
              that.
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
              Access ends right away. Use this if you need to stop the plan now.
            </span>
          </span>
        </button>

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={cancelling}
            onClick={onClose}
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
  );
}
