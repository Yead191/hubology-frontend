import type { MembershipPlan } from "@/types";

/**
 * Legacy static plans — membership page now loads from GET /membership.
 * Kept only if something still imports helpers for demos.
 */
export const MEMBERSHIP_PLANS: MembershipPlan[] = [];

export function getPlan(id: string | null): MembershipPlan | null {
  if (!id) return null;
  return MEMBERSHIP_PLANS.find((p) => p._id === id) ?? null;
}
