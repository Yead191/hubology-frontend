"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";

import type { Pagination, Vendor } from "@/types";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { VendorCard } from "@/features/vendors/sections/vendor-card";
import { VendorPagination } from "@/features/vendors/sections/vendor-pagination";
import {
  VendorFilters,
  DEFAULT_FILTERS,
  type VendorFilterState,
} from "@/features/vendors/sections/vendor-filters";

interface VendorsProps {
  vendors: Vendor[];
  pagination?: Pagination;
  filters: VendorFilterState & { page: number; limit: number };
}

/** Build a /vendors query string from the current filter + page state. */
function buildVendorsHref(
  filters: VendorFilterState,
  page: number,
  limit: number,
) {
  const params = new URLSearchParams();
  const search = (filters.search ?? "").trim();
  if (search) params.set("searchTerm", search);
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.hourlyRateRange) {
    params.set("hourlyRateRange", filters.hourlyRateRange);
  }
  if (page > 1) params.set("page", String(page));
  if (limit !== 10) params.set("limit", String(limit));
  const qs = params.toString();
  return qs ? `/vendors?${qs}` : "/vendors";
}

export default function Vendors({ vendors, pagination, filters }: VendorsProps) {
  const router = useRouter();
  // Local search text for responsive typing; URL updates are debounced.
  const [searchInput, setSearchInput] = React.useState(filters.search ?? "");

  React.useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);

  const push = React.useCallback(
    (next: VendorFilterState, page = 1) => {
      router.push(buildVendorsHref(next, page, filters.limit));
    },
    [router, filters.limit],
  );

  // Debounce search → URL so we don't refetch on every keystroke.
  React.useEffect(() => {
    if (searchInput === filters.search) return;
    const timer = setTimeout(() => {
      push(
        {
          search: searchInput,
          availability: filters.availability,
          hourlyRateRange: filters.hourlyRateRange,
        },
        1,
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, filters, push]);

  const update = React.useCallback(
    <K extends keyof VendorFilterState>(key: K, value: VendorFilterState[K]) => {
      if (key === "search") {
        setSearchInput(value as string);
        return;
      }
      push(
        {
          search: searchInput,
          availability: filters.availability,
          hourlyRateRange: filters.hourlyRateRange,
          [key]: value,
        },
        1,
      );
    },
    [push, searchInput, filters.availability, filters.hourlyRateRange],
  );

  const reset = React.useCallback(() => {
    setSearchInput("");
    router.push("/vendors");
  }, [router]);

  const uiFilters: VendorFilterState = {
    search: searchInput,
    availability: filters.availability,
    hourlyRateRange: filters.hourlyRateRange,
  };

  const total = pagination?.total ?? vendors.length;

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <header className="max-w-2xl">
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
              Meet the <span className="text-gradient">Hubology vendors</span>
            </h1>
            <p className="mt-3 text-pretty text-mist">
              Every expert is manually reviewed. Search, filter, and find the
              right person — then reach out directly by phone or email.
            </p>
          </header>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <VendorFilters
            filters={uiFilters}
            onChange={update}
            onReset={reset}
            resultCount={total}
          />
        </Reveal>

        {vendors?.length > 0 ? (
          <>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vendors?.map((vendor, i) => (
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
              <VendorPagination
                pagination={pagination}
                onPageChange={(page) => push(uiFilters, page)}
              />
            ) : null}
          </>
        ) : (
          <Reveal className="border-gradient mt-8 flex flex-col items-center rounded-3xl bg-panel/30 px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/4 text-violet-bright">
              <SearchX className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-cloud">
              No experts match your filters
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-mist">
              Try broadening your search or clearing a filter to see more.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export { DEFAULT_FILTERS };
