import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck, Lock, Star } from "lucide-react";

import {
  getServiceDetail,
  getServiceSlugs,
  getServicePackage,
} from "@/data/services";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { BookNowButton } from "@/features/service-booking/sections/book-now-button";

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

const REASSURANCE = [
  { icon: ShieldCheck, text: "Handled by manually-verified experts" },
  { icon: Lock, text: "Secure payment powered by Stripe" },
  { icon: Star, text: "Trusted by founders worldwide" },
];

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) notFound();

  const pkg = getServicePackage(slug);

  return (
    <>
      {/* Overview */}
      <section className="relative overflow-hidden pt-36">
        <Aurora
          animated
          className="-top-16 right-0 h-112 w-xl opacity-40"
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

              {pkg && (
                <Reveal delay={320}>
                  <div className="mt-2 flex flex-wrap items-center gap-4 rounded-2xl border border-hairline-strong bg-panel/40 px-5 py-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-faint">From</span>
                      <span className="font-display text-2xl font-bold text-cloud">
                        {formatPrice(pkg.price.amount, pkg.price.currency)}
                      </span>
                      <span className="text-sm text-mist">
                        / {pkg.price.frequency}
                      </span>
                    </div>
                    <BookNowButton service={pkg} className="ml-auto">
                      Book now
                    </BookNowButton>
                  </div>
                </Reveal>
              )}
            </div>

            <Reveal delay={120}>
              <div className="border-gradient relative aspect-5/4 overflow-hidden rounded-[1.75rem] glow-soft">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 576px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/50 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      {pkg && (
        <section className="relative mx-auto max-w-6xl px-6 pt-28">
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
                  {formatPrice(pkg.price.amount, pkg.price.currency)}
                </span>
                <span className="text-sm text-mist">/ {pkg.price.frequency}</span>
              </div>

              <BookNowButton service={pkg} size="lg" className="min-w-56">
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
      )}
    </>
  );
}
