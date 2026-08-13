"use client";

import * as React from "react";
import Link from "next/link";

import type { UserSubscription } from "@/types";
import { normalizeSubscriptionStatus } from "@/lib/forum";
import { recurringPeriodLabel } from "@/lib/membership";
import { Button } from "@/components/ui/button";
import {
  DashboardPanel,
  StatusPill,
  formatDate,
  formatMoney,
  statusTone,
} from "@/features/dashboard/ui";
import { CancelSubscriptionModal } from "@/features/membership/sections/cancel-subscription-modal";

/** Membership summary card on the dashboard overview. */
export function DashboardMembershipCard({
  subscription,
}: {
  subscription: UserSubscription | null;
}) {
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const status = normalizeSubscriptionStatus(subscription?.status);
  const canCancel = Boolean(subscription?._id) && status === "active";

  return (
    <>
      <DashboardPanel
        title="Membership"
        description="Your current subscription status."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canCancel ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setCancelOpen(true)}
              >
                Cancel plan
              </Button>
            ) : null}
            <Button asChild size="sm" variant="outline">
              <Link href="/membership">View plans</Link>
            </Button>
          </div>
        }
      >
        {subscription ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-lg font-semibold text-cloud">
                {subscription.name}
              </p>
              <StatusPill
                value={subscription.status || "—"}
                tone={statusTone(subscription.status)}
              />
            </div>
            <p className="text-mist">
              {formatMoney(subscription.price)} /{" "}
              {recurringPeriodLabel(subscription.recuring)}
            </p>
            <p className="text-mist">
              {status === "cancel-pending" ? "Access" : "Active"}{" "}
              {formatDate(subscription.start_date)} →{" "}
              {formatDate(subscription.end_date)}
            </p>
            {subscription.auto_renew != null ? (
              <p className="text-mist">
                Auto-renew{" "}
                <span className="font-medium text-cloud">
                  {subscription.auto_renew ? "On" : "Off"}
                </span>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-hairline-strong px-4 py-8 text-center">
            <p className="text-sm text-mist">No active membership yet.</p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/membership">Explore plans</Link>
            </Button>
          </div>
        )}
      </DashboardPanel>

      {subscription?._id ? (
        <CancelSubscriptionModal
          open={cancelOpen}
          onClose={() => setCancelOpen(false)}
          subscriptionId={subscription._id}
          endDate={subscription.end_date}
          planName={subscription.name}
        />
      ) : null}
    </>
  );
}
