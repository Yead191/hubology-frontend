import type { Metadata } from "next";
import { Building, Receipt, FileText, Users, Globe } from "lucide-react";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about Hubology — the digital ecosystem helping entrepreneurs with company registration, bookkeeping, tax readiness, a vetted B2B marketplace, and a global peer network.",
  path: "/about",
  keywords: [
    "about Hubology",
    "The HUBology",
    "business growth ecosystem",
    "company registration platform",
    "founder bookkeeping services",
    "vetted B2B marketplace",
    "entrepreneur peer network",
  ],
});

const deliverables = [
  {
    title: "Company Registration",
    description:
      "Launch your legal entity with fast, error-free corporate and tax registrations.",
    icon: Building,
  },
  {
    title: "On-Demand Bookkeeping",
    description:
      "Keep your ledgers perfectly balanced with monthly financial reporting and reconciled receipts.",
    icon: Receipt,
  },
  {
    title: "Tax Season Readiness",
    description:
      "Receive organized financial records to maximize tax deductions and ensure compliance.",
    icon: FileText,
  },
  {
    title: "Vetted B2B Marketplace",
    description:
      "Connect with verified freelancers, agencies, and vendors to outsource tasks with total confidence.",
    icon: Users,
  },
  {
    title: "Global Peer Network",
    description:
      "Engage in safe, collaborative forums to share strategies, find co-founders, or unlock new capital.",
    icon: Globe,
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-32 pb-24">
      {/* Background Ambience */}
      <Aurora
        animated
        className="-top-20 left-1/2 h-150 w-250 -translate-x-1/2 opacity-30"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8 z-10">
        {/* Header / Hero */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-cloud sm:text-5xl md:text-6xl">
              About <span className="text-gradient">The HUBology</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-mist md:text-xl">
              Welcome to The HUBology, the ultimate digital ecosystem designed
              to accelerate the growth of modern businesses, entrepreneurs, and
              freelancers. We bridge the gap between ambition and execution by
              providing a unified platform where professionals connect, learn,
              and scale their operations.
            </p>
          </div>
        </Reveal>

        {/* Mission Statement */}
        <Reveal delay={100}>
          <div className="border-gradient relative mt-20 overflow-hidden rounded-3xl bg-panel/30 px-8 py-12 text-center md:px-16 md:py-20 glow-soft">
            <h2 className="font-display text-2xl font-bold text-cloud md:text-3xl">
              Our Mission
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-mist leading-relaxed">
              To democratize business growth by giving every entrepreneur and
              small business owner—regardless of size or location—the tools,
              network, and insights needed to thrive in a competitive digital
              economy.
            </p>
          </div>
        </Reveal>

        {/* What We Deliver */}
        <div className="mt-32">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold text-cloud md:text-4xl">
                What We Deliver
              </h2>
              <p className="mt-4 text-mist">
                Everything you need to run and scale your business seamlessly.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={i * 80} className="h-full">
                  <div className="border-gradient group flex h-full flex-col rounded-3xl bg-panel/40 p-8 transition-all duration-500 hover:-translate-y-1 hover:bg-panel/70 hover:glow-violet">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-violet-bright transition-colors group-hover:bg-violet-bright group-hover:text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-3 font-display text-xl font-semibold text-cloud">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-mist">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <Reveal delay={200}>
          <div className="mt-32 rounded-3xl border border-hairline bg-ink-700/50 p-8 md:p-16 lg:flex lg:items-center lg:justify-between lg:gap-16">
            <div className="lg:max-w-xl">
              <h2 className="font-display text-3xl font-bold text-cloud md:text-4xl">
                Why Choose Us?
              </h2>
              <div className="mt-6 space-y-6 text-lg leading-relaxed text-mist">
                <p>
                  We understand that running a business is complex. Most
                  founders waste hours switching between disjointed software and
                  searching for reliable advice.
                </p>
                <p>
                  <strong className="text-cloud">The HUBology</strong>{" "}
                  eliminates that friction. We centralize your essential
                  business needs into one powerful hub so you can focus entirely
                  on what matters:{" "}
                  <span className="text-violet-bright font-medium">
                    scaling your revenue.
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 shrink-0">
              <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full border border-hairline-strong bg-panel/50 glow-violet flex items-center justify-center">
                <Aurora className="inset-0 opacity-40" />
                <div className="relative z-10 text-center">
                  <span className="block font-display text-5xl font-bold text-cloud">
                    100%
                  </span>
                  <span className="mt-2 block text-sm font-medium uppercase tracking-widest text-mist">
                    Focus on Growth
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
