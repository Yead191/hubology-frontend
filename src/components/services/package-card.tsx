import Link from "next/link";
import { Check } from "lucide-react";

import type { ServicePackage } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BookNowButton } from "@/features/service-booking/sections/book-now-button";

export function PackageCard({ pkg }: { pkg: ServicePackage }) {
  return (
    <div
      className={cn(
        "border-gradient group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 ease-out-soft hover:-translate-y-1.5",
        pkg.featured
          ? "bg-panel/70 glow-violet"
          : "bg-panel/40 hover:bg-panel/70 hover:glow-violet",
      )}
    >
      {pkg.featured && (
        <Badge variant="solid" className="absolute -top-3 left-8">
          Most popular
        </Badge>
      )}

      <header className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold uppercase tracking-wide text-cloud">
          {pkg.title}
        </h3>
        <p className="text-sm text-mist">{pkg.tagline}</p>
      </header>

      <div className="mt-6 flex items-end gap-1.5">
        <span className="text-xs font-medium text-faint">Starting from</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-cloud">
          {formatPrice(pkg.price.amount, pkg.price.currency)}
        </span>
        <span className="text-sm text-mist">/ {pkg.price.frequency}</span>
      </div>

      <ul className="mt-7 flex flex-1 flex-col gap-3.5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-cloud/85">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-bright">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-2.5">
        <BookNowButton
          service={pkg}
          variant={pkg.featured ? "default" : "outline"}
          className="w-full"
          style={{
            background: pkg.featured
              ? "linear-gradient(160deg, #6e22e6 50%, #d65df3 80%)"
              : "",
            border: pkg.featured ? "1px solid #fff" : "",
          }}
        >
          Book now
        </BookNowButton>
        <Link
          href={`/services/${pkg.slug}`}
          className="text-center text-sm font-medium text-mist transition-colors hover:text-cloud"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
