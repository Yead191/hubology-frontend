import type { Metadata } from "next";

import type { MembershipPlan, MembershipRecurring } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import Membership from "@/features/membership";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Unlock the Hubology community forum, verified experts, and member perks. Simple plans, cancel anytime.",
};

interface PageProps {
  searchParams: Promise<{ recurring?: string }>;
}

function parseRecurring(value?: string): MembershipRecurring {
  return value === "year" ? "year" : "month";
}

export default async function MembershipPage({ searchParams }: PageProps) {
  const { recurring: raw } = await searchParams;
  const recurring = parseRecurring(raw);

  const [res, user] = await Promise.all([
    nextFetch<MembershipPlan[]>(`/membership?recurring=${recurring}`, {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["membership"], revalidate: 60 * 60 },
    }),
    getProfile(),
  ]);

  const plans = res.success ? (res.data ?? []) : [];

  return (
    <Membership
      plans={plans}
      recurring={recurring}
      subscription={user?.subscription ?? null}
      isLoggedIn={Boolean(user)}
    />
  );
}
