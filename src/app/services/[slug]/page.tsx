import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck, Lock, Star } from "lucide-react";

import type { ServicePackage } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { buildMetadata } from "@/lib/seo";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { BookNowButton } from "@/features/service-booking/sections/book-now-button";

interface PageProps {
  /** Route param is named `slug` but carries the service `_id` from the API. */
  params: Promise<{ slug: string }>;
}

async function getService(id: string) {
  const res = await nextFetch<ServicePackage>(`/services/${id}`, {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["services", `service-${id}`], revalidate: 60 * 60 },
  });
  return res.success ? res.data : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: id } = await params;
  const service = await getService(id);
  if (!service) {
    return buildMetadata({
      title: "Service not found",
      description: "This Hubology service package could not be found.",
      path: `/services/${id}`,
      noIndex: true,
    });
  }

  const description =
    service.tagline ||
    service.longDescription ||
    `Book ${service.title} with verified Hubology experts.`;

  return buildMetadata({
    title: service.title,
    description: description.slice(0, 160),
    path: `/services/${id}`,
    image: getImageUrl(service.image),
    keywords: [
      service.title,
      "Hubology service package",
      "book business expert",
      "verified consultant service",
      ...(service.features ?? []).slice(0, 4),
    ],
  });
}

const REASSURANCE = [
  { icon: ShieldCheck, text: "Handled by manually-verified experts" },
  { icon: Lock, text: "Secure payment powered by Stripe" },
  { icon: Star, text: "Trusted by founders worldwide" },
];

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug: id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  const imageSrc = getImageUrl(service.image);
  const features = service.features ?? [];

  return (
    <>
      {/* Overview */}
      <section className="relative overflow-hidden pt-36">
        <Aurora animated className="-top-16 right-0 h-112 w-xl opacity-40" />
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
              {service.featured ? (
                <Reveal>
                  <Badge variant="solid">Most popular</Badge>
                </Reveal>
              ) : null}

              <Reveal delay={80}>
                <h1 className="text-balance text-4xl font-bold leading-[1.1] text-cloud sm:text-5xl">
                  {service.title}
                </h1>
              </Reveal>

              {service.tagline ? (
                <Reveal delay={140}>
                  <p className="text-lg leading-relaxed text-mist">
                    {service.tagline}
                  </p>
                </Reveal>
              ) : null}

              {service.longDescription ? (
                <Reveal delay={200}>
                  <p className="text-base leading-relaxed text-mist/80">
                    {service.longDescription}
                  </p>
                </Reveal>
              ) : null}

              {features.length > 0 ? (
                <Reveal delay={260}>
                  <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2.5 text-sm text-cloud/85"
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-bright">
                          <Check className="h-3 w-3" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              <Reveal delay={320}>
                <div className="mt-2 flex flex-wrap items-center gap-4 rounded-2xl border border-hairline-strong bg-panel/40 px-5 py-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-faint">From</span>
                    <span className="font-display text-2xl font-bold text-cloud">
                      {formatPrice(
                        service.price.amount,
                        service.price.currency,
                      )}
                    </span>
                    <span className="text-sm text-mist">
                      / {service.price.frequency}
                    </span>
                  </div>
                  <BookNowButton service={service} className="ml-auto">
                    Book now
                  </BookNowButton>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div className="border-gradient relative aspect-5/4 overflow-hidden rounded-[1.75rem] glow-soft">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 576px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-panel" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-ink/50 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-8">
        <Reveal className="border-gradient glow-soft overflow-hidden rounded-4xl bg-panel/60">
          <div className="flex flex-col items-center gap-8 p-8 text-center sm:p-12">
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-balance font-display text-3xl font-bold text-cloud sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="max-w-md text-pretty text-mist">
                Book {service.title} in under a minute. Tell us what you need,
                pay securely, and we&apos;ll take it from there.
              </p>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold text-cloud">
                {formatPrice(service.price.amount, service.price.currency)}
              </span>
              <span className="text-sm text-mist">
                / {service.price.frequency}
              </span>
            </div>

            <BookNowButton service={service} size="lg" className="min-w-56">
              Book now
            </BookNowButton>

            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {REASSURANCE.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-2 text-sm text-mist"
                >
                  <Icon className="h-4 w-4 text-violet-bright" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </>
  );
}
