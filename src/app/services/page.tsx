import type { Metadata } from "next";

import { getServicePackages } from "@/data/services";
import { PackageCard } from "@/components/services/package-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/ui/aurora";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse Hubology service packages and connect with verified experts across formation, tax, legal, branding, growth, and fundraising.",
};

export default function ServicesPage() {
  const packages = getServicePackages();

  return (
    <>
      <section className="relative overflow-hidden pt-36">
        <Aurora
          animated
          className="-top-10 left-1/2 h-[30rem] w-[44rem] -translate-x-1/2 opacity-50"
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

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.slug} delay={(i % 3) * 80} className="h-full">
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
