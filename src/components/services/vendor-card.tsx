import Image from "next/image";
import { Mail, Phone, Star, MapPin } from "lucide-react";

import type { Vendor } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <article className="border-gradient group flex h-full flex-col rounded-3xl bg-panel/40 p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-panel/70 hover:glow-violet">
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
          <h3 className="truncate text-lg font-semibold text-cloud">
            {vendor.name}
          </h3>
          <p className="text-sm text-violet-bright">{vendor.role}</p>
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

      <p className="mt-5 flex-1 text-sm leading-relaxed text-mist">
        {vendor.description}
      </p>

      <div className="mt-6 flex items-baseline gap-1 border-t border-hairline pt-5">
        <span className="text-xs text-faint">Starting at</span>
        <span className="ml-1 text-2xl font-bold text-cloud">
          {formatPrice(vendor.startingPrice)}
        </span>
      </div>

      {/* Direct contact — no on-platform payment, members reach out themselves */}
      <div className="mt-5 flex flex-col gap-2.5">
        <Button asChild className="w-full">
          <a href={`tel:${vendor.contact.phone.replace(/\s+/g, "")}`}>
            <Phone className="h-4 w-4" />
            Call {vendor.contact.phone}
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <a href={`mailto:${vendor.contact.email}`}>
            <Mail className="h-4 w-4" />
            Email expert
          </a>
        </Button>
      </div>
    </article>
  );
}
