"use client";

import { FileSpreadsheet, UserCheck, Eye, Award, CheckSquare } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function IFundAyitiHowItWorks() {
  const steps = [
    {
      icon: FileSpreadsheet,
      title: "1. Apply Online",
      desc: "Complete the multistepper form during an open period. Upload your National ID and details. No account creation needed."
    },
    {
      icon: UserCheck,
      title: "2. Track Status",
      desc: "Save the generated Tracking ID. Track your verification live with your ID and date of birth."
    },
    {
      icon: Eye,
      title: "3. Vetting & Approval",
      desc: "The vetting board reviews files. Approved candidates are displayed on the public dashboard."
    },
    {
      icon: Award,
      title: "4. Finalists & Winner",
      desc: "5 finalists are selected. One winner is selected per period and awarded the $1,000 micro-grant."
    },
    {
      icon: CheckSquare,
      title: "5. Manual Transfer",
      desc: "The organization processes payment manually outside the system to guarantee secure routing."
    }
  ];

  return (
    <section className="relative py-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <Reveal>
            <span className="eyebrow">Interactive Timeline</span>
            <h2 className="mt-3 text-3xl font-bold font-display text-cloud sm:text-4xl">
              How the Program Works
            </h2>
            <p className="mt-4 text-mist">
              A step-by-step transparent flow from application to direct fund transfer.
            </p>
          </Reveal>
        </div>

        {/* Timeline wrapper */}
        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="absolute top-9 left-8 right-36 hidden h-0.5 -translate-y-1/2 bg-linear-to-r from-violet/20 via-violet/50 to-violet/20 lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal
                  key={i}
                  delay={i * 80}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left h-full"
                >
                  {/* Icon Circle */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-panel-soft border border-hairline-strong text-violet-bright transition-all duration-300 hover:glow-violet hover:scale-105 hover:bg-panel">
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Text details */}
                  <h3 className="mt-6 text-lg font-semibold font-display text-cloud">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-mist leading-relaxed">
                    {step.desc}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
