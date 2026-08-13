"use client";

import { useRouter } from "next/navigation";
import { Eye, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";

import type {
  Faq,
  MembershipPlan,
  MembershipRecurring,
  TrialEligibility,
  UserSubscription,
} from "@/types";
import { hasActiveSubscription } from "@/lib/forum";
import { recurringHref } from "@/lib/membership";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { BillingToggle } from "@/features/membership/sections/billing-toggle";
import { PlanCard } from "@/features/membership/sections/plan-card";
import { ActivePlanBanner } from "@/features/membership/sections/active-plan-banner";
import { MembershipFaq } from "@/features/membership/sections/membership-faq";

export type MembershipAudience = "user" | "vendor";

const COPY: Record<
  MembershipAudience,
  {
    basePath: string;
    title: React.ReactNode;
    subtitle: string;
    trust: { icon: typeof MessagesSquare; label: string }[];
  }
> = {
  user: {
    basePath: "/membership",
    title: (
      <>
        One membership,{" "}
        <span className="text-gradient">the whole hub</span>
      </>
    ),
    subtitle:
      "Your key to the community forum, verified experts, and everything founders need to grow. Choose the plan that fits where you are.",
    trust: [
      { icon: MessagesSquare, label: "Your key to the community forum" },
      { icon: ShieldCheck, label: "Cancel anytime, no lock-in" },
      { icon: Sparkles, label: "New perks added every month" },
    ],
  },
  vendor: {
    basePath: "/membership/vendor",
    title: (
      <>
        Get listed.{" "}
        <span className="text-gradient">Get discovered.</span>
      </>
    ),
    subtitle:
      "Vendor membership puts your expert profile in the Hubology directory so founders can find, contact, and book you. Choose the plan that fits your practice.",
    trust: [
      { icon: Eye, label: "Appear in the public vendor directory" },
      { icon: ShieldCheck, label: "Cancel anytime, no lock-in" },
      { icon: Sparkles, label: "Reach founders actively looking for help" },
    ],
  },
};

export default function Membership({
  audience = "user",
  plans,
  faqs,
  recurring,
  subscription,
  isLoggedIn,
  userRole,
  trialEligibility = null,
}: {
  audience?: MembershipAudience;
  plans: MembershipPlan[];
  faqs: Faq[];
  recurring: MembershipRecurring;
  subscription: UserSubscription | null;
  isLoggedIn: boolean;
  userRole?: string | null;
  trialEligibility?: TrialEligibility | null;
}) {
  const router = useRouter();
  const copy = COPY[audience];
  const activeSubscription = hasActiveSubscription(subscription)
    ? subscription
    : null;

  function setRecurring(next: MembershipRecurring) {
    router.push(recurringHref(copy.basePath, next));
  }

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20">
        <Aurora
          animated
          className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-50"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h1 className="mt-3 text-balance font-display text-4xl font-bold leading-[1.1] text-cloud sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-mist">
              {copy.subtitle}
            </p>
          </Reveal>

          {activeSubscription ? (
            <Reveal className="mx-auto mt-10 max-w-3xl">
              <ActivePlanBanner subscription={activeSubscription} />
            </Reveal>
          ) : null}

          <Reveal delay={80} className="mt-10 flex justify-center">
            <BillingToggle
              value={recurring}
              onChange={setRecurring}
              basePath={copy.basePath}
            />
          </Reveal>

          {plans.length > 0 ? (
            <div
              className={`mt-12 grid gap-6 ${plans.length === 1 ? "mx-auto max-w-md md:grid-cols-1" : plans.length === 2 ? "mx-auto max-w-3xl md:grid-cols-2" : "md:grid-cols-3"}`}
            >
              {plans.map((plan, i) => (
                <Reveal key={plan._id} delay={(i % 3) * 90} className="h-full">
                  <PlanCard
                    plan={plan}
                    subscription={activeSubscription}
                    isLoggedIn={isLoggedIn}
                    redirectBase={copy.basePath}
                    audience={audience}
                    userRole={userRole}
                    trialEligibility={trialEligibility}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-12 max-w-md rounded-3xl border border-dashed border-hairline-strong bg-panel/30 px-6 py-12 text-center">
              <p className="text-mist">
                No {recurring === "year" ? "yearly" : recurring === "week" ? "weekly" : "monthly"}{" "}
                {audience === "vendor" ? "vendor" : "member"} plans available
                right now.
              </p>
            </div>
          )}

          <Reveal
            delay={120}
            className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {copy.trust.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-sm text-mist"
              >
                <Icon className="h-4 w-4 text-violet-bright" />
                {label}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <MembershipFaq faqs={faqs} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
