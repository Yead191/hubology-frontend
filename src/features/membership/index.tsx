"use client";

import { MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";

import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { useMembership } from "@/features/membership/membership-context";
import { BillingToggle } from "@/features/membership/sections/billing-toggle";
import { PlanCard } from "@/features/membership/sections/plan-card";
import { ActivePlanBanner } from "@/features/membership/sections/active-plan-banner";
import { MembershipFaq } from "@/features/membership/sections/membership-faq";

const TRUST = [
  { icon: MessagesSquare, label: "Your key to the community forum" },
  { icon: ShieldCheck, label: "Cancel anytime, no lock-in" },
  { icon: Sparkles, label: "New perks added every month" },
];

export default function Membership() {
  const { plans, billingCycle, setBillingCycle, isSubscribed } =
    useMembership();

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20">
        <Aurora
          animated
          className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-50"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Membership</span>
            <h1 className="mt-3 text-balance font-display text-4xl font-bold leading-[1.1] text-cloud sm:text-5xl">
              One membership,{" "}
              <span className="text-gradient">the whole hub</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-mist">
              Your key to the community forum, verified experts, and everything
              founders need to grow. Choose the plan that fits where you are.
            </p>
          </Reveal>

          {/* Active plan banner (only when subscribed) */}
          {isSubscribed && (
            <Reveal className="mx-auto mt-10 max-w-3xl">
              <ActivePlanBanner />
            </Reveal>
          )}

          {/* Billing toggle */}
          <Reveal delay={80} className="mt-10 flex justify-center">
            <BillingToggle value={billingCycle} onChange={setBillingCycle} />
          </Reveal>

          {/* Plans */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((plan, i) => (
              <Reveal key={plan.id} delay={(i % 3) * 90} className="h-full">
                <PlanCard plan={plan} />
              </Reveal>
            ))}
          </div>

          {/* Trust strip */}
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

      {/* FAQ */}
      <section className="relative px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <MembershipFaq />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
