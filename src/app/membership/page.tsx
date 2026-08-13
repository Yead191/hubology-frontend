import type { Metadata } from "next";

import type {
  Faq,
  MembershipPlan,
  TrialEligibility,
} from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import Membership from "@/features/membership";
import { parseRecurring } from "@/lib/membership";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Member Membership Plans",
  description:
    "Unlock the Hubology community forum, verified expert access, and member perks. Compare weekly, monthly, and yearly plans for founders — cancel anytime.",
  path: "/membership",
  keywords: [
    "Hubology membership",
    "founder membership plans",
    "community forum access",
    "entrepreneur membership",
    "weekly monthly yearly business membership",
  ],
});

interface PageProps {
  searchParams: Promise<{ recurring?: string }>;
}

export default async function MembershipPage({ searchParams }: PageProps) {
  const { recurring: raw } = await searchParams;
  const recurring = parseRecurring(raw);
  const user = await getProfile();

  const [plansRes, faqsRes, eligibilityRes] = await Promise.all([
    nextFetch<MembershipPlan[]>(
      `/membership?recurring=${recurring}&type=user`,
      {
        method: "GET",
        cache: "force-cache",
        next: { tags: ["membership", "membership-user"], revalidate: 60 * 60 },
      },
    ),
    nextFetch<Faq[]>(`/faq?audience=USER`, {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["faq", "faq-user"], revalidate: 60 * 60 },
    }),
    user
      ? nextFetch<TrialEligibility>("/subscription/trial-eligibility", {
          method: "GET",
          cache: "no-store",
        })
      : Promise.resolve(null),
  ]);

  const plans = plansRes.success ? (plansRes.data ?? []) : [];
  const faqs = faqsRes.success ? (faqsRes.data ?? []) : [];
  const trialEligibility =
    eligibilityRes && eligibilityRes.success
      ? (eligibilityRes.data ?? null)
      : null;

  return (
    <Membership
      audience="user"
      plans={plans}
      faqs={faqs}
      recurring={recurring}
      subscription={user?.subscription ?? null}
      isLoggedIn={Boolean(user)}
      userRole={user?.role ?? null}
      trialEligibility={trialEligibility}
    />
  );
}
