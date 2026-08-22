"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  Sparkles,
  Tag,
} from "lucide-react";

import type { Partner } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

export function PartnerDetail({ partner }: { partner: Partner }) {
  const logo = getImageUrl(partner.image);
  const website = partner.website?.trim();
  const websiteLabel = website?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <section className="relative min-h-screen overflow-x-clip pt-28 pb-20">
      <Aurora
        animated
        className="-top-16 left-1/2 h-140 w-200 -translate-x-1/2 opacity-35"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
            <Link href="/partners">
              <ArrowLeft className="h-4 w-4" />
              All partners
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
          {/* Brand panel */}
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-hairline-strong bg-panel/60 p-8 backdrop-blur-md sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet/25 blur-3xl"
              />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative flex h-36 w-full max-w-xs items-center justify-center rounded-2xl border border-hairline bg-white/4 p-6">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={partner.name}
                      fill
                      priority
                      sizes="320px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="font-display text-3xl font-bold text-violet-bright">
                      {partner.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {partner.featured ? (
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-violet/35 bg-violet/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-bright">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured partner
                  </span>
                ) : null}

                <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-cloud sm:text-4xl">
                  {partner.name}
                </h1>

                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-bright transition-colors hover:text-violet"
                  >
                    <Globe className="h-4 w-4" />
                    {websiteLabel}
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>

          {/* Contact + offers */}
          <Reveal delay={80}>
            <div className="flex flex-col gap-5">
              <div className="rounded-3xl border border-hairline bg-panel/50 p-5 backdrop-blur-md sm:p-6">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                  Get in touch
                </h2>
                <ul className="mt-4 space-y-3">
                  {partner.contactEmail ? (
                    <li>
                      <a
                        href={`mailto:${partner.contactEmail}`}
                        className="flex items-center gap-3 rounded-2xl border border-hairline bg-white/3 px-4 py-3 text-sm text-cloud transition-colors hover:bg-white/5"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
                          <Mail className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 truncate">
                          {partner.contactEmail}
                        </span>
                      </a>
                    </li>
                  ) : null}
                  {partner.contactPhone ? (
                    <li>
                      <a
                        href={`tel:${partner.contactPhone}`}
                        className="flex items-center gap-3 rounded-2xl border border-hairline bg-white/3 px-4 py-3 text-sm text-cloud transition-colors hover:bg-white/5"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
                          <Phone className="h-4 w-4" />
                        </span>
                        {partner.contactPhone}
                      </a>
                    </li>
                  ) : null}
                  {website ? (
                    <li>
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-hairline bg-white/3 px-4 py-3 text-sm text-cloud transition-colors hover:bg-white/5"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
                          <Globe className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 truncate">{websiteLabel}</span>
                        <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-faint" />
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>

              {(partner.offers ?? []).length > 0 ? (
                <div className="rounded-3xl border border-hairline bg-panel/50 p-5 backdrop-blur-md sm:p-6">
                  <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                    <Tag className="h-3.5 w-3.5" />
                    What they offer
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {partner.offers!.map((offer) => (
                      <li
                        key={offer}
                        className="rounded-full border border-hairline-strong bg-white/4 px-3.5 py-1.5 text-sm font-medium text-cloud"
                      >
                        {offer}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-10">
          <div className="rounded-3xl border border-hairline bg-panel/40 p-6 backdrop-blur-md sm:p-8">
            <h2 className="font-display text-xl font-semibold text-cloud">
              About {partner.name}
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-mist">
              {partner.description ||
                "This partner is part of the Hubology network."}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
