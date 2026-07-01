import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, BadgeCheck, ArrowRight } from "lucide-react";

import type { Vendor } from "@/types";

/** Directory card for a single vendor, linking to their full profile. */
export function VendorCard({ vendor }: { vendor: Vendor }) {
  const shownExpertise = vendor.expertise.slice(0, 3);
  const extra = vendor.expertise.length - shownExpertise.length;

  return (
    <article className="border-gradient group flex h-full flex-col rounded-3xl bg-panel/40 p-6 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:bg-panel/70 hover:glow-violet">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-violet/25">
          <Image
            src={vendor.profile}
            alt={vendor.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="flex items-center gap-1.5 truncate text-lg font-semibold text-cloud">
            <span className="truncate">{vendor.name}</span>
            <BadgeCheck
              className="h-4 w-4 shrink-0 text-violet-bright"
              aria-label="Verified expert"
            />
          </h3>
          <p className="truncate text-sm text-violet-bright">
            {vendor.role}
            <span className="text-mist"> · {vendor.company}</span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {vendor.rating.toFixed(1)}
              <span className="text-faint">({vendor.reviews})</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {vendor.location}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-5 line-clamp-2 flex-1 text-sm leading-relaxed text-mist">
        {vendor.bio}
      </p>

      {/* Expertise chips */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {shownExpertise.map((e) => (
          <span
            key={e}
            className="rounded-full border border-hairline-strong bg-white/[0.03] px-2.5 py-1 text-xs text-cloud/80"
          >
            {e}
          </span>
        ))}
        {extra > 0 && (
          <span className="rounded-full border border-hairline-strong bg-white/[0.03] px-2.5 py-1 text-xs text-faint">
            +{extra}
          </span>
        )}
      </div>

      {/* Rate + availability */}
      <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4 text-sm">
        <span className="text-cloud">
          <span className="font-semibold">{vendor.hourlyRate}</span>
          <span className="text-faint"> /hr</span>
        </span>
        <span className="text-xs text-mist">{vendor.availability}</span>
      </div>

      <Link
        href={`/vendors/${vendor.slug}`}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-hairline-strong bg-white/[0.03] px-6 py-2.5 text-sm font-semibold text-cloud transition-all duration-300 ease-out-soft hover:border-violet/50 hover:bg-white/[0.07]"
      >
        View profile
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
