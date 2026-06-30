import { ShieldCheck, TrendingUp, LayoutGrid } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Trusted & Verified Experts",
    description:
      "Every expert is manually vetted before they join. You only ever talk to senior people who have solved your problem before.",
  },
  {
    icon: TrendingUp,
    title: "Resources That Drive Growth",
    description:
      "Playbooks, tools, and one-on-one sessions built to move real numbers — not generic advice you have already read.",
  },
  {
    icon: LayoutGrid,
    title: "All Your Business Needs in One Place",
    description:
      "Formation, tax, legal, branding, growth, and fundraising — stop stitching advice together across ten different chats.",
  },
];

export function WhyHubology() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-32">
      <SectionHeading
        eyebrow="Why Hubology"
        title="Why make Hubology your go-to?"
        subtitle="One trusted platform that brings verified expertise, growth resources, and community together."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {reasons.map((reason, i) => (
          <Reveal
            key={reason.title}
            delay={i * 90}
            className="border-gradient group relative flex flex-col gap-5 rounded-3xl bg-panel/40 p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-panel/70 hover:glow-violet"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_8px_24px_-8px_rgba(129,49,240,0.8)] transition-transform duration-500 group-hover:scale-110">
              <reason.icon className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-semibold text-cloud">{reason.title}</h3>
            <p className="text-sm leading-relaxed text-mist">
              {reason.description}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
