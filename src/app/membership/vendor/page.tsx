import type { Metadata } from "next";

import type { Faq, MembershipPlan, MembershipRecurring } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import Membership from "@/features/membership";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Vendor Membership Plans",
  description:
    "Subscribe to a Hubology vendor plan to appear in the expert directory, get discovered by founders, and grow your consulting practice.",
  path: "/membership/vendor",
  keywords: [
    "Hubology vendor membership",
    "vendor subscription",
    "expert directory listing",
    "consultant membership plans",
    "verified expert subscription",
  ],
});

interface PageProps {
  searchParams: Promise<{ recurring?: string }>;
}

function parseRecurring(value?: string): MembershipRecurring {
  return value === "year" ? "year" : "month";
}

export default async function VendorMembershipPage({ searchParams }: PageProps) {
  const { recurring: raw } = await searchParams;
  const recurring = parseRecurring(raw);
  const user = await getProfile();

  const [plansRes, faqsRes] = await Promise.all([
    nextFetch<MembershipPlan[]>(
      `/membership?recurring=${recurring}&type=vendor`,
      {
        method: "GET",
        cache: "force-cache",
        next: {
          tags: ["membership", "membership-vendor"],
          revalidate: 60 * 60,
        },
      },
    ),
    nextFetch<Faq[]>(`/faq?audience=VENDOR`, {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["faq", "faq-vendor"], revalidate: 60 * 60 },
    }),
  ]);

  const plans = plansRes.success ? (plansRes.data ?? []) : [];
  const faqs = faqsRes.success ? (faqsRes.data ?? []) : [];

  return (
    <Membership
      audience="vendor"
      plans={plans}
      faqs={faqs}
      recurring={recurring}
      subscription={user?.subscription ?? null}
      isLoggedIn={Boolean(user)}
      userRole={user?.role ?? null}
    />
  );
}
