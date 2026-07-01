import type { MembershipPlan } from "@/types";

/* ------------------------------------------------------------------ *
 * Membership plans — the key that unlocks the community forum and the
 * wider member experience. Three demo tiers; all include forum access.
 * Prices are per-month; yearly billing shows a discounted monthly rate.
 * ------------------------------------------------------------------ */
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For founders finding their footing.",
    priceMonthly: 19,
    priceYearly: 15,
    currency: "$",
    features: [
      "Full community forum access",
      "Browse the verified expert directory",
      "Monthly group Q&A sessions",
      "Member resource library",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For teams ready to move faster.",
    priceMonthly: 49,
    priceYearly: 39,
    currency: "$",
    featured: true,
    highlight: "Most popular",
    features: [
      "Everything in Starter",
      "Priority forum support from experts",
      "1 private expert session / month",
      "Member-only events & workshops",
      "10% off all store services",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "For scaling businesses that want it all.",
    priceMonthly: 99,
    priceYearly: 79,
    currency: "$",
    features: [
      "Everything in Pro",
      "Unlimited private expert sessions",
      "A dedicated success advisor",
      "Early access to new features",
      "VIP invites & concierge support",
    ],
  },
];

export function getPlan(id: string | null): MembershipPlan | null {
  if (!id) return null;
  return MEMBERSHIP_PLANS.find((p) => p.id === id) ?? null;
}
