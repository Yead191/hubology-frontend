import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { getServiceDetail, getServiceSlugs } from "@/data/services";
import { getVendorsByService } from "@/data/vendors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { VendorCard } from "@/components/services/vendor-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) return { title: "Service not found" };
  return { title: service.title, description: service.overview };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) notFound();

  const vendors = getVendorsByService(slug);

  return (
    <>
      {/* Overview */}
      <section className="relative overflow-hidden pt-36">
        <Aurora
          animated
          className="-top-16 right-0 h-[28rem] w-[36rem] opacity-40"
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
              <Link href="/services">
                <ArrowLeft className="h-4 w-4" /> All services
              </Link>
            </Button>
          </Reveal>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Reveal>
                <Badge>{service.category}</Badge>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-balance text-4xl font-bold leading-[1.1] text-cloud sm:text-5xl">
                  {service.title}
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="text-lg leading-relaxed text-mist">
                  {service.overview}
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-base leading-relaxed text-mist/80">
                  {service.longDescription}
                </p>
              </Reveal>
              <Reveal delay={260}>
                <ul className="mt-2 grid grid-cols-2 gap-3">
                  {service.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-2.5 text-sm text-cloud/85"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-bright">
                        <Check className="h-3 w-3" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div className="border-gradient relative aspect-[5/4] overflow-hidden rounded-[1.75rem] glow-soft">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 576px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Meet experts */}
      <section className="relative mx-auto max-w-6xl px-6 pt-32">
        <SectionHeading
          align="left"
          eyebrow="Meet the experts"
          title="Verified vendors for this service"
          subtitle="Each expert has been manually reviewed. Reach out directly by phone or email to book a session — no payment needed here."
        />

        {vendors.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor, i) => (
              <Reveal key={vendor.id} delay={(i % 3) * 80} className="h-full">
                <VendorCard vendor={vendor} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-12 rounded-3xl border border-dashed border-hairline-strong bg-panel/30 p-12 text-center">
            <p className="text-mist">
              We are onboarding experts for this service. Check back soon, or{" "}
              <Link href="/join" className="text-violet-bright hover:underline">
                join as an expert
              </Link>
              .
            </p>
          </Reveal>
        )}
      </section>
    </>
  );
}
