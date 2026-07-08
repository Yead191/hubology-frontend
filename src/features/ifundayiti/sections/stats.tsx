"use client";

import { Users, FileCheck, Landmark, HeartHandshake, HelpCircle, Trophy } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { useIFundAyiti } from "../context/ifundayiti-context";

export function IFundAyitiStats() {
  const { stats } = useIFundAyiti();

  const data = [
    {
      icon: Users,
      label: "Total Applications",
      value: stats.totalApplications.toLocaleString(),
      desc: "All submitted requests",
    },
    {
      icon: FileCheck,
      label: "Approved Applicants",
      value: stats.approvedApplicants.toLocaleString(),
      desc: "Fully vetted projects",
    },
    {
      icon: Landmark,
      label: "Current Program Fund",
      value: formatPrice(stats.currentProgramFund),
      desc: "Active capital pool",
      highlight: true,
    },
    {
      icon: HeartHandshake,
      label: "Total Donations",
      value: formatPrice(stats.totalDonations),
      desc: "Cumulative donor support",
    },
    {
      icon: Trophy,
      label: "Total Winners",
      value: stats.totalWinners.toLocaleString(),
      desc: "Grants funded so far",
    },
  ];

  return (
    <section className="relative py-20 bg-ink-700/20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <span className="eyebrow">Impact Metrics</span>
            <h2 className="mt-3 text-3xl font-bold font-display text-cloud sm:text-4xl">
              Live Program Statistics
            </h2>
            <p className="mt-4 text-mist">
              Direct tracking of accumulated donor contributions, application volumes, and distributed grants.
            </p>
          </Reveal>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {data.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal 
                key={i} 
                delay={i * 70} 
                className={`border-gradient group relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-500 ease-out-soft hover:-translate-y-1 ${
                  item.highlight 
                    ? "bg-panel/80 glow-violet border-violet/30" 
                    : "bg-panel/30 hover:bg-panel/50"
                }`}
              >
                <div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${
                    item.highlight 
                      ? "bg-violet/20 text-violet-bright" 
                      : "bg-white/5 text-mist group-hover:text-cloud"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <span className="block font-display text-3xl font-bold tracking-tight text-cloud mt-2">
                    {item.value}
                  </span>
                  
                  <h3 className="text-sm font-semibold text-cloud/85 mt-2">
                    {item.label}
                  </h3>
                </div>
                
                <p className="text-xs text-faint mt-3">
                  {item.desc}
                </p>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
