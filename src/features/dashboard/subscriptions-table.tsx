"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import { normalizeSubscriptionStatus } from "@/lib/forum";
import { recurringPeriodLabel } from "@/lib/membership";
import { Button } from "@/components/ui/button";
import { CancelSubscriptionModal } from "@/features/membership/sections/cancel-subscription-modal";
import {
  DashboardPanel,
  DashboardTable,
  EmptyDash,
  StatusPill,
  formatDate,
  formatMoney,
  statusTone,
} from "@/features/dashboard/ui";

export interface DashboardSubscription {
  _id: string;
  name?: string;
  recuring?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  features?: string[];
  trxId?: string;
  payment_intent_id?: string;
  createdAt?: string;
  is_trial?: boolean;
  trial_period_days?: number;
  trial_end_date?: string;
  auto_renew?: boolean;
}

export function SubscriptionsTable({
  subscriptions,
}: {
  subscriptions: DashboardSubscription[];
}) {
  const [cancelTarget, setCancelTarget] =
    React.useState<DashboardSubscription | null>(null);

  return (
    <>
      <DashboardPanel
        title="Subscription history"
        description="Membership plans you’ve purchased."
      >
        {subscriptions.length === 0 ? (
          <>
            <EmptyDash
              title="No subscriptions yet"
              message="Unlock the community forum and member perks with a Hubology plan."
            />
            <div className="mt-4 flex justify-center">
              <Button asChild size="sm">
                <Link href="/membership">View membership plans</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <DashboardTable
              headers={[
                "Plan",
                "Billing",
                "Price",
                "Period",
                "Auto-renew",
                "Trial",
                "Status",
                "",
              ]}
            >
              {subscriptions.map((s) => {
                const isTrial = Boolean(s.is_trial);
                const trialDays = s.trial_period_days ?? 0;
                const status = normalizeSubscriptionStatus(s.status);
                const canCancel = Boolean(s._id) && status === "active";

                return (
                  <tr key={s._id} className="hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-cloud">
                          {s.name || "Plan"}
                        </span>
                        {isTrial ? (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                            <Sparkles className="h-3 w-3" />
                            Trial
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-mist">
                      {s.recuring || "—"}
                    </td>
                    <td className="px-4 py-3 text-cloud">
                      {formatMoney(s.price)}
                      <span className="text-xs text-faint">
                        {" "}
                        / {recurringPeriodLabel(s.recuring)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-mist">
                      {formatDate(s.start_date)} → {formatDate(s.end_date)}
                    </td>
                    <td className="px-4 py-3 text-mist">
                      {s.auto_renew == null ? (
                        <span className="text-faint">—</span>
                      ) : s.auto_renew ? (
                        <span className="text-emerald-300">On</span>
                      ) : (
                        <span className="text-faint">Off</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-mist">
                      {isTrial || trialDays > 0 || s.trial_end_date ? (
                        <div className="flex flex-col gap-0.5">
                          {trialDays > 0 ? (
                            <span className="text-cloud">
                              {trialDays} day{trialDays === 1 ? "" : "s"}
                            </span>
                          ) : (
                            <span className="text-cloud">Trial</span>
                          )}
                          {s.trial_end_date ? (
                            <span className="text-xs text-faint">
                              Ends {formatDate(s.trial_end_date)}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill
                        value={s.status || "—"}
                        tone={statusTone(s.status)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canCancel ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setCancelTarget(s)}
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </DashboardTable>

            {subscriptions[0]?.features?.length ? (
              <div className="rounded-2xl border border-hairline bg-white/3 p-4">
                <p className="text-sm font-medium text-cloud">
                  Latest plan features — {subscriptions[0].name}
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {subscriptions[0].features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-mist"
                    >
                      <Check className="h-3.5 w-3.5 text-violet-bright" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </DashboardPanel>

      <CancelSubscriptionModal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        subscriptionId={cancelTarget?._id ?? ""}
        endDate={cancelTarget?.end_date}
        planName={cancelTarget?.name}
      />
    </>
  );
}
