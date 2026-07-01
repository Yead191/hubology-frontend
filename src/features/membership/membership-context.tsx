"use client";

import * as React from "react";

import type { BillingCycle, MembershipPlan } from "@/types";
import { useAuth } from "@/components/auth/auth-context";
import { MEMBERSHIP_PLANS, getPlan } from "@/data/membership";

interface MembershipContextValue {
  plans: MembershipPlan[];
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;

  activePlan: MembershipPlan | null;
  isSubscribed: boolean;
  subscribe: (planId: string) => void;
  cancel: () => void;

  /**
   * Whether the current viewer may enter the community forum.
   * Verified experts are always allowed; members need an active plan.
   */
  hasForumAccess: boolean;
  /** True when the viewer is a member who simply hasn't subscribed yet. */
  needsMembership: boolean;
}

const MembershipContext = React.createContext<MembershipContextValue | null>(
  null,
);

/**
 * Frontend-only membership state. Holds the active plan + billing cycle
 * in memory (resets on reload, matching the demo auth pattern). Swap for
 * a real billing/subscription source when a backend exists.
 */
export function MembershipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn } = useAuth();
  const [activePlanId, setActivePlanId] = React.useState<string | null>(null);
  const [billingCycle, setBillingCycle] =
    React.useState<BillingCycle>("monthly");

  const subscribe = React.useCallback((planId: string) => {
    setActivePlanId(planId);
  }, []);

  const cancel = React.useCallback(() => setActivePlanId(null), []);

  const activePlan = getPlan(activePlanId);
  const isSubscribed = activePlan !== null;
  const isExpert = user?.role === "expert";
  const hasForumAccess = isLoggedIn && (isExpert || isSubscribed);
  const needsMembership = isLoggedIn && !isExpert && !isSubscribed;

  const value = React.useMemo<MembershipContextValue>(
    () => ({
      plans: MEMBERSHIP_PLANS,
      billingCycle,
      setBillingCycle,
      activePlan,
      isSubscribed,
      subscribe,
      cancel,
      hasForumAccess,
      needsMembership,
    }),
    [
      billingCycle,
      activePlan,
      isSubscribed,
      subscribe,
      cancel,
      hasForumAccess,
      needsMembership,
    ],
  );

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const ctx = React.useContext(MembershipContext);
  if (!ctx)
    throw new Error("useMembership must be used within a MembershipProvider");
  return ctx;
}
