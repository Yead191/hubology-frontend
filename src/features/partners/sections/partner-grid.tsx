"use client";

import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Partner, Pagination } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { PartnerCard } from "@/features/partners/sections/partner-card";
import {
  buildPartnersHref,
  type PartnerListParams,
} from "@/features/partners/query";

export function PartnerGrid({
  partners,
  pagination,
  params,
}: {
  partners: Partner[];
  pagination?: Pagination;
  params: PartnerListParams;
}) {
  const router = useRouter();

  function goToPage(page: number) {
    router.replace(buildPartnersHref(page, params.limit), { scroll: false });
  }

  if (partners.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-hairline-strong bg-panel/30 px-6 py-16 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/4 text-faint">
          <Building2 className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold text-cloud">
          No partners yet
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-mist">
          Check back soon — new partners are added regularly.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {pagination?.total != null ? (
        <p className="mb-4 text-xs text-faint">
          {pagination.total} partner{pagination.total === 1 ? "" : "s"}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {partners.map((partner, i) => (
          <Reveal key={partner._id} delay={Math.min(i * 40, 200)}>
            <PartnerCard partner={partner} />
          </Reveal>
        ))}
      </div>

      {pagination ? (
        <PaginationControls pagination={pagination} onPageChange={goToPage} />
      ) : null}
    </div>
  );
}

export function PartnerCardsSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-2xl border border-hairline bg-panel/40"
        />
      ))}
    </div>
  );
}
