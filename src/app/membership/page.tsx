import type { Metadata } from "next";

import type { MembershipPlan, MembershipRecurring } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import Membership from "@/features/membership";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Membership Plans",
  description:
    "Unlock the Hubology community forum, verified expert access, and member perks. Compare monthly and yearly plans for founders and vendors — cancel anytime.",
  path: "/membership",
  keywords: [
    "Hubology membership",
    "founder membership plans",
    "community forum access",
    "vendor subscription",
    "entrepreneur membership",
    "monthly yearly business membership",
  ],
});

interface PageProps {
  searchParams: Promise<{ recurring?: string }>;
}

function parseRecurring(value?: string): MembershipRecurring {
  return value === "year" ? "year" : "month";
}

export default async function MembershipPage({ searchParams }: PageProps) {
  const { recurring: raw } = await searchParams;
  const recurring = parseRecurring(raw);
  const user = await getProfile();

  const res = await nextFetch<MembershipPlan[]>(
    `/membership?recurring=${recurring}&type=${user?.role?.toLowerCase() ?? "user"}`,
    {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["membership"], revalidate: 60 * 60 },
    },
  );

  const plans = res.success ? (res.data ?? []) : [];
  // console.log(user)
  return (
    <Membership
      plans={plans}
      recurring={recurring}
      subscription={user?.subscription ?? null}
      isLoggedIn={Boolean(user)}
    />
  );
}
