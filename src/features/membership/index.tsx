"use client";

import { useRouter } from "next/navigation";
import { MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";

import type {
  MembershipPlan,
  MembershipRecurring,
  UserSubscription,
} from "@/types";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { BillingToggle } from "@/features/membership/sections/billing-toggle";
import { PlanCard } from "@/features/membership/sections/plan-card";
import { ActivePlanBanner } from "@/features/membership/sections/active-plan-banner";
import { MembershipFaq } from "@/features/membership/sections/membership-faq";

const TRUST = [
  { icon: MessagesSquare, label: "Your key to the community forum" },
  { icon: ShieldCheck, label: "Cancel anytime, no lock-in" },
  { icon: Sparkles, label: "New perks added every month" },
];

export default function Membership({
  plans,
  recurring,
  subscription,
  isLoggedIn,
}: {
  plans: MembershipPlan[];
  recurring: MembershipRecurring;
  subscription: UserSubscription | null;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  function setRecurring(next: MembershipRecurring) {
    const params = new URLSearchParams();
    if (next === "year") params.set("recurring", "year");
    const qs = params.toString();
    router.push(qs ? `/membership?${qs}` : "/membership");
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
              One membership,{" "}
              <span className="text-gradient">the whole hub</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-mist">
              Your key to the community forum, verified experts, and everything
              founders need to grow. Choose the plan that fits where you are.
            </p>
          </Reveal>

          {subscription ? (
            <Reveal className="mx-auto mt-10 max-w-3xl">
              <ActivePlanBanner subscription={subscription} />
            </Reveal>
          ) : null}

          <Reveal delay={80} className="mt-10 flex justify-center">
            <BillingToggle value={recurring} onChange={setRecurring} />
          </Reveal>

          {plans.length > 0 ? (
            <div
              className={`mt-12 grid gap-6 ${plans.length === 1 ? "mx-auto max-w-md md:grid-cols-1" : plans.length === 2 ? "mx-auto max-w-3xl md:grid-cols-2" : "md:grid-cols-3"}`}
            >
              {plans.map((plan, i) => (
                <Reveal key={plan._id} delay={(i % 3) * 90} className="h-full">
                  <PlanCard
                    plan={plan}
                    subscription={subscription}
                    isLoggedIn={isLoggedIn}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-12 max-w-md rounded-3xl border border-dashed border-hairline-strong bg-panel/30 px-6 py-12 text-center">
              <p className="text-mist">
                No {recurring === "year" ? "yearly" : "monthly"} plans available
                right now.
              </p>
            </div>
          )}

          <Reveal
            delay={120}
            className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {TRUST.map(({ icon: Icon, label }) => (
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
          <MembershipFaq />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
