"use client";

import { Heart, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { useIFundAyiti } from "../context/ifundayiti-context";

export function IFundAyitiHero() {
  const { setShowAppModal, setShowDonModal, period } = useIFundAyiti();
  const isPeriodOpen = period.status === "Open";

  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-40 md:pb-32">
      {/* Background decorations */}
      <Aurora
        animated
        className="-top-20 left-1/2 h-140 w-180 -translate-x-1/2 opacity-40"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(129,49,240,0.05),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          
          {/* Eyebrow badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs font-semibold text-violet-bright backdrop-blur-md uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isPeriodOpen ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${isPeriodOpen ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
              Application Period: {period.status} {isPeriodOpen && `(Ends ${period.endDate})`}
            </div>
          </Reveal>

          {/* Heading */}
          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-cloud sm:text-6xl leading-[1.05]">
              Empowering Haitian Entrepreneurs,{" "}
              <span className="text-gradient">One Micro-Grant at a Time</span>
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-mist">
              Directly boosting local initiatives in Haiti. All public donations build our community fund. Vetted applicant finalists receive up to <span className="text-cloud font-semibold">$1,000 grants</span> to launch and scale their ideas.
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={180} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => setShowDonModal(true)}
              className="w-full sm:w-auto glow-violet flex items-center justify-center gap-2 group cursor-pointer"
              style={{
                background: "linear-gradient(160deg, #8131f0 30%, #b549ff 80%)",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              <Heart className="h-4 w-4 fill-white/10 group-hover:scale-110 transition-transform" />
              Donate to Program Fund
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowAppModal(true)}
              disabled={!isPeriodOpen}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-hairline-strong bg-white/4 text-cloud hover:bg-white/8 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              {isPeriodOpen ? "Apply for a Grant" : "Applications Closed"}
              {isPeriodOpen && <ArrowRight className="h-4 w-4" />}
            </Button>
          </Reveal>

          {/* Helper message when period is closed */}
          {!isPeriodOpen && (
            <Reveal delay={220}>
              <p className="mt-3 text-xs text-amber-300/80">
                The application period is currently closed for vetting. You can still support our program fund via donations!
              </p>
            </Reveal>
          )}

        </div>
      </div>
    </section>
  );
}
