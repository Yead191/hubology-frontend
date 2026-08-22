import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Partner } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { partnerHref } from "@/features/partners/query";

/** Minimal list tile — logo + name only; full details on the detail page. */
export function PartnerCard({
  partner,
  className,
}: {
  partner: Partner;
  className?: string;
}) {
  const logo = getImageUrl(partner.image);
  const href = partnerHref(partner._id);

  return (
    <Link
      href={href}
      className={cn(
        "border-gradient group relative flex flex-col items-center overflow-hidden rounded-2xl bg-panel/40 px-5 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-panel/65 hover:glow-violet sm:py-8",
        className,
      )}
    >
      {partner.featured ? (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-bright">
          <Sparkles className="h-3 w-3" />
        </span>
      ) : null}

      <div className="relative flex h-16 w-full max-w-36 items-center justify-center sm:h-[4.5rem] sm:max-w-40">
        {logo ? (
          <Image
            src={logo}
            alt={partner.name}
            fill
            sizes="160px"
            className="object-contain opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <span className="font-display text-xl font-bold text-violet-bright">
            {partner.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <h3 className="mt-5 line-clamp-2 font-display text-sm font-semibold leading-snug text-cloud transition-colors group-hover:text-violet-bright sm:text-base">
        {partner.name}
      </h3>

      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-faint opacity-0 transition-all duration-300 group-hover:text-violet-bright group-hover:opacity-100">
        View details
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
