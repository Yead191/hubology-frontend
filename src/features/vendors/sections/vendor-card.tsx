import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, ArrowRight } from "lucide-react";

import type { Vendor } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { getAvailabilityLabel } from "@/lib/validators";

/** Directory card for a single vendor, linking to their full profile. */
export function VendorCard({ vendor }: { vendor: Vendor }) {
  const profile = vendor.vendorProfile;
  const expertise = profile?.expertise ?? [];
  const shownExpertise = expertise.slice(0, 3);
  const extra = expertise.length - shownExpertise.length;
  const imageSrc = getImageUrl(vendor.image);

  return (
    <article className="border-gradient group flex min-w-0 w-full h-full flex-col rounded-3xl bg-panel/40 p-6 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:bg-panel/70 hover:glow-violet">
      <div className="flex w-full min-w-0 items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-panel ring-2 ring-violet/25">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={vendor.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="flex items-center gap-1.5 text-lg font-semibold text-cloud">
            <span className="truncate">{vendor.name}</span>
            {vendor.verified ? (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-violet-bright"
                aria-label="Verified expert"
              />
            ) : null}
          </h3>
          <p className="truncate text-sm text-violet-bright">
            {profile?.jobTitle || "Expert"}
            {vendor.company ? (
              <span className="text-mist"> · {vendor.company}</span>
            ) : null}
          </p>
        </div>
      </div>

      <p className="mt-5 line-clamp-2 flex-1 text-sm leading-relaxed text-mist">
        {profile?.bio || "No bio provided yet."}
      </p>

      {/* Expertise chips */}
      {shownExpertise.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {shownExpertise.map((e) => (
            <span
              key={e}
              className="rounded-full border border-hairline-strong bg-white/3 px-2.5 py-1 text-xs text-cloud/80"
            >
              {e}
            </span>
          ))}
          {extra > 0 && (
            <span className="rounded-full border border-hairline-strong bg-white/3 px-2.5 py-1 text-xs text-faint">
              +{extra}
            </span>
          )}
        </div>
      ) : null}

      {/* Rate + availability */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-4 text-sm">
        <span className="shrink-0 text-cloud">
          <span className="font-semibold">
            {formatPrice(profile?.hourlyRate ?? 0)}
          </span>
          <span className="text-faint"> /hr</span>
        </span>
        {profile?.availability ? (
          <span className="text-xs text-mist">
            {getAvailabilityLabel(profile.availability)}
          </span>
        ) : null}
      </div>

      <Link
        href={`/vendors/${vendor._id}`}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-hairline-strong bg-white/3 px-6 py-2.5 text-sm font-semibold text-cloud transition-all duration-300 ease-out-soft hover:border-violet/50 hover:bg-white/7"
      >
        View profile
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
