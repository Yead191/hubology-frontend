"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import type { PartnerLogo } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { partnerHref } from "@/features/partners/query";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";

/** Repeat logos so one strip is wide enough to scroll smoothly on large screens. */
function buildMarqueeStrip(logos: PartnerLogo[], minItems = 8): PartnerLogo[] {
  const repeats = Math.max(1, Math.ceil(minItems / logos.length));
  return Array.from({ length: repeats }, () => logos).flat();
}

/** Infinite marquee of partner logos — pauses on hover; click opens detail. */
export function PartnerLogoCarousel({ logos }: { logos: PartnerLogo[] }) {
  const [paused, setPaused] = React.useState(false);
  const strip = React.useMemo(
    () => (logos.length > 0 ? buildMarqueeStrip(logos) : []),
    [logos],
  );
  const duration = `${Math.max(strip.length * 5, 28)}s`;

  if (logos.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-ink to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-ink to-transparent sm:w-24" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Partners"
            title="Meet Our Trusted Partners"
            subtitle="Discover the businesses and professionals supporting Hubology members with valuable services, exclusive offers, and special benefits."
            align="center"
          />
        </Reveal>
      </div>

      <div
        className="relative mt-12 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          className="partner-marquee-track flex w-max will-change-transform"
          data-paused={paused ? "true" : "false"}
          style={
            {
              "--partner-marquee-duration": duration,
            } as React.CSSProperties
          }
        >
          <MarqueeStrip logos={strip} ariaHidden={false} />
          <MarqueeStrip logos={strip} ariaHidden />
        </div>
      </div>
    </section>
  );
}

function MarqueeStrip({
  logos,
  ariaHidden = false,
}: {
  logos: PartnerLogo[];
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-5 pr-5 sm:gap-6 sm:pr-6"
      aria-hidden={ariaHidden || undefined}
    >
      {logos.map((logo, index) => (
        <PartnerLogoTile
          key={`${logo._id}-${index}`}
          partner={logo}
          tabIndex={ariaHidden ? -1 : undefined}
        />
      ))}
    </div>
  );
}

function PartnerLogoTile({
  partner,
  tabIndex,
}: {
  partner: PartnerLogo;
  tabIndex?: number;
}) {
  const src = getImageUrl(partner.image);
  const href = partnerHref(partner._id);

  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      className="group relative flex h-28 w-44 shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-panel/50 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 hover:bg-panel/80 hover:shadow-[0_16px_40px_-12px_rgba(129,49,240,0.45)] sm:h-32 sm:w-52"
    >
      <div className="relative h-14 w-full sm:h-16">
        {src ? (
          <Image
            src={src}
            alt={partner.name}
            fill
            sizes="208px"
            className="object-contain opacity-90 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <span className="grid h-full place-items-center font-display text-lg font-semibold text-violet-bright">
            {partner.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-ink/95 via-ink/80 to-transparent px-3 pb-3 pt-8 text-center text-xs font-semibold text-cloud opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        {partner.name}
      </span>
    </Link>
  );
}
