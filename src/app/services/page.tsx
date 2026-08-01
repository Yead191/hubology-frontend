import type { Metadata } from "next";
import { Suspense } from "react";

import { PackageCard } from "@/components/services/package-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/ui/aurora";
import { CtaBand } from "@/components/sections/cta-band";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import type { ServicePackage } from "@/types";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Business Services & Expert Packages",
  description:
    "Browse Hubology service packages and book verified experts for company formation, tax strategy, legal counsel, branding, growth marketing, and fundraising.",
  path: "/services",
  keywords: [
    "business consulting services",
    "company formation services",
    "tax strategy consultants",
    "legal counsel for startups",
    "brand strategy experts",
    "growth marketing consultants",
    "fundraising advisors",
    "hire verified business experts",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36">
        <Aurora
          animated
          className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-50"
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Services"
            title={
              <>
                Expert help for every stage of your{" "}
                <span className="text-gradient">business</span>
              </>
            }
            subtitle="Choose a service to meet verified vendors. Pricing starts where shown — you contact and book each expert directly."
          />

          {/* Header renders instantly; the cards stream in once fetched. */}
          <Suspense fallback={<ServicesGridSkeleton />}>
            <ServicesGrid />
          </Suspense>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

/** Async island: fetches the service packages and renders the grid. */
async function ServicesGrid() {
  const packagesRes = await nextFetch<ServicePackage[]>("/services", {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["services"], revalidate: 60 * 60 },
  });

  if (!packagesRes.success) {
    return (
      <p className="mt-16 rounded-2xl border border-hairline bg-panel/40 px-6 py-10 text-center text-sm text-mist">
        We couldn&apos;t load services right now. Please try again shortly.
      </p>
    );
  }

  const packages = packagesRes.data ?? [];

  if (packages.length === 0) {
    return (
      <p className="mt-16 rounded-2xl border border-hairline bg-panel/40 px-6 py-10 text-center text-sm text-mist">
        No services are available at the moment. Check back soon.
      </p>
    );
  }

  return (
    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg, i) => (
        <Reveal key={pkg._id ?? pkg.slug ?? i} delay={(i % 3) * 80} className="h-full">
          <PackageCard pkg={pkg} />
        </Reveal>
      ))}
    </div>
  );
}

/** Loading placeholder shown while the services are being fetched. */
function ServicesGridSkeleton() {
  return (
    <div
      aria-hidden
      className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border-gradient flex h-full animate-pulse flex-col rounded-3xl bg-panel/40 p-8"
        >
          <div className="h-5 w-2/3 rounded-md bg-white/8" />
          <div className="mt-3 h-4 w-full rounded-md bg-white/5" />
          <div className="mt-2 h-4 w-4/5 rounded-md bg-white/5" />

          <div className="mt-7 h-9 w-1/2 rounded-md bg-white/8" />

          <div className="mt-8 flex flex-1 flex-col gap-3.5">
            {Array.from({ length: 3 }).map((__, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-5 w-5 shrink-0 rounded-full bg-white/8" />
                <div className="h-4 w-3/4 rounded-md bg-white/5" />
              </div>
            ))}
          </div>

          <div className="mt-8 h-12 w-full rounded-full bg-white/8" />
        </div>
      ))}
    </div>
  );
}
