"use client";

import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Pagination, Vendor } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { VendorCard } from "@/features/vendors/sections/vendor-card";
import { VendorPagination } from "@/features/vendors/sections/vendor-pagination";
import type { VendorFilterState } from "@/features/vendors/sections/vendor-filters";
import { buildVendorsHref } from "@/features/vendors/query";

export function VendorGrid({
  vendors,
  pagination,
  filters,
}: {
  vendors: Vendor[];
  pagination?: Pagination;
  filters: VendorFilterState & { page: number; limit: number };
}) {
  const router = useRouter();

  function goToPage(page: number) {
    router.replace(buildVendorsHref(filters, page, filters.limit), {
      scroll: false,
    });
  }

  if (vendors.length === 0) {
    return (
      <div className="border-gradient mt-8 flex flex-col items-center rounded-3xl bg-panel/30 px-6 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/4 text-violet-bright">
          <SearchX className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold text-cloud">
          No experts match your filters
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-mist">
          Try broadening your search or clearing a filter to see more.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor, i) => (
          <Reveal
            key={vendor._id}
            delay={(i % 3) * 80}
            className="h-full min-w-0"
          >
            <VendorCard vendor={vendor} />
          </Reveal>
        ))}
      </div>

      {pagination ? (
        <VendorPagination pagination={pagination} onPageChange={goToPage} />
      ) : null}
    </>
  );
}

export function VendorCardsSkeleton() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border-gradient h-72 animate-pulse rounded-3xl bg-panel/40"
        />
      ))}
    </div>
  );
}
