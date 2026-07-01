"use client";

import * as React from "react";
import { SearchX } from "lucide-react";

import { getAllVendors } from "@/data/vendors";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { VendorCard } from "@/features/vendors/sections/vendor-card";
import {
  VendorFilters,
  DEFAULT_FILTERS,
  type VendorFilterState,
} from "@/features/vendors/sections/vendor-filters";

export default function Vendors() {
  const allVendors = React.useMemo(() => getAllVendors(), []);
  const [filters, setFilters] = React.useState<VendorFilterState>(DEFAULT_FILTERS);

  const update = React.useCallback(
    <K extends keyof VendorFilterState>(key: K, value: VendorFilterState[K]) =>
      setFilters((f) => ({ ...f, [key]: value })),
    [],
  );
  const reset = React.useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const vendors = React.useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    return allVendors.filter((v) => {
      if (filters.expertise !== "all" && !v.expertise.includes(filters.expertise))
        return false;
      if (filters.rate !== "all" && v.hourlyRate !== filters.rate) return false;
      if (
        filters.availability !== "all" &&
        v.availability !== filters.availability
      )
        return false;
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.role.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.bio.toLowerCase().includes(q) ||
        v.expertise.some((e) => e.toLowerCase().includes(q))
      );
    });
  }, [allVendors, filters]);

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <Reveal>
          <header className="max-w-2xl">
            <span className="eyebrow">Verified experts</span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
              Meet the <span className="text-gradient">Hubology vendors</span>
            </h1>
            <p className="mt-3 text-pretty text-mist">
              Every expert is manually reviewed. Search, filter, and find the
              right person — then reach out directly by phone or email.
            </p>
          </header>
        </Reveal>

        {/* Filters */}
        <Reveal delay={80} className="mt-10">
          <VendorFilters
            filters={filters}
            onChange={update}
            onReset={reset}
            resultCount={vendors.length}
          />
        </Reveal>

        {/* Results */}
        {vendors.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor, i) => (
              <Reveal key={vendor.id} delay={(i % 3) * 80} className="h-full">
                <VendorCard vendor={vendor} />
              </Reveal>
            ))}
          </div>
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
