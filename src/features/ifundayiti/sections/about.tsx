"use client";

import { Info, HelpCircle, DollarSign, CheckCircle, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function IFundAyitiAbout() {
  const requirements = [
    "Must reside permanently in Haiti.",
    "Must have a valid National Identification Number (NIF / CIN).",
    "Must run or propose a local micro-business or community project.",
    "Max grant request must not exceed $1,000 USD.",
    "Willingness to upload proof of address and identification document."
  ];

  return (
    <section className="relative py-20 bg-ink-700/40 border-y border-hairline">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <span className="eyebrow">Program Details</span>
            <h2 className="mt-3 text-3xl font-bold font-display text-cloud sm:text-4xl">
              About the Micro-Grant Program
            </h2>
            <p className="mt-4 text-mist">
              Transparency, accountability, and direct impact are the core pillars of IFundAyiti.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          
          {/* Card 1: What is it? */}
          <Reveal delay={80} className="border-gradient rounded-3xl p-8 bg-panel/30 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/10 text-violet-bright mb-6">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-semibold font-display text-cloud mb-4">What is IFundAyiti?</h3>
            <p className="text-mist leading-relaxed mb-4">
              IFundAyiti is an initiative by Hubology designed to bootstrap local Haitian-owned micro-businesses, agricultural projects, and clean energy solutions. 
            </p>
            <p className="text-mist leading-relaxed">
              Instead of matching donors to individual campaigns, <strong className="text-cloud font-medium">100% of all public donations are aggregated into a single IFundAyiti Program Fund</strong>. Our local vetting board reviews each application, selecting finalists to receive debt-free capital.
            </p>
          </Reveal>

          {/* Card 2: Guidelines & Payouts */}
          <Reveal delay={120} className="border-gradient rounded-3xl p-8 bg-panel/30 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/10 text-violet-bright mb-6">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-semibold font-display text-cloud mb-4">The $1,000 Micro-Grant</h3>
            <p className="text-mist leading-relaxed mb-4">
              Haitian builders and vendors face interest rates upwards of 35% at local institutions, lock-out criteria, and extensive overhead. Our program bypasses traditional collateral requirements.
            </p>
            <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
              <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/90 leading-relaxed">
                <strong>Important Note:</strong> Direct funding campaigns are not run on individual profiles. Capital is manually paid out directly to verified selected winners outside of the platform to ensure full security.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Requirements block */}
        <Reveal delay={160} className="mt-12 border-gradient rounded-3xl p-8 md:p-10 bg-panel/25">
          <h3 className="text-xl font-semibold font-display text-cloud mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-violet-bright" />
            Who is Eligible to Apply?
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-mist">
                <span className="h-2 w-2 rounded-full bg-violet-bright shrink-0 mt-2" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Reveal>

      </div>
    </section>
  );
}
