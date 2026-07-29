"use client";

import Link from "next/link";
import { BadgeCheck, ArrowRight } from "lucide-react";

import type { UserSubscription } from "@/types";
import { Button } from "@/components/ui/button";

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
 * subscription on their profile.
 */
export function ActivePlanBanner({
  subscription,
}: {
  subscription: UserSubscription;
}) {
  return (
    <div className="border-gradient glow-violet flex flex-col gap-4 rounded-3xl bg-panel/70 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
          <BadgeCheck className="h-6 w-6" />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-cloud">
            You&apos;re on the {subscription.name} plan
          </p>
          <p className="text-sm text-mist">
            Active through {formatDate(subscription.end_date)} · community forum
            access unlocked
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
      </div>
    </div>
  );
}
