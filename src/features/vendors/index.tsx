"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { UserSubscription } from "@/types";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { VendorSubscriptionModal } from "@/features/vendors/sections/vendor-subscription-modal";
import {
  VendorFilters,
  DEFAULT_FILTERS,
  type VendorFilterState,
} from "@/features/vendors/sections/vendor-filters";
import { buildVendorsHref } from "@/features/vendors/query";

interface VendorsProps {
  filters: VendorFilterState & { page: number; limit: number };
  viewer?: {
    role?: string;
    subscription?: UserSubscription | null;
    isProfileVisible?: boolean;
  } | null;
  /** Server-rendered vendor cards — only this slot suspends on search. */
  children: React.ReactNode;
}

export default function Vendors({ filters, viewer, children }: VendorsProps) {
  const router = useRouter();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const keepSearchFocus = React.useRef(false);
  const [searchInput, setSearchInput] = React.useState(filters.search ?? "");

  React.useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);

  React.useEffect(() => {
    if (!keepSearchFocus.current) return;
    keepSearchFocus.current = false;
    searchRef.current?.focus();
  });

  const replaceFilters = React.useCallback(
    (next: VendorFilterState, page = 1) => {
      router.replace(buildVendorsHref(next, page, filters.limit), {
        scroll: false,
      });
    },
    [router, filters.limit],
  );

  React.useEffect(() => {
    if (searchInput === filters.search) return;
    const timer = setTimeout(() => {
      keepSearchFocus.current = true;
      replaceFilters(
        {
          search: searchInput,
          availability: filters.availability,
          hourlyRateRange: filters.hourlyRateRange,
          expertise: filters.expertise,
        },
        1,
      );
      requestAnimationFrame(() => searchRef.current?.focus());
    }, 600);
    return () => clearTimeout(timer);
  }, [searchInput, filters, replaceFilters]);

  const update = React.useCallback(
    <K extends keyof VendorFilterState>(
      key: K,
      value: VendorFilterState[K],
    ) => {
      if (key === "search") {
        keepSearchFocus.current = true;
        setSearchInput(value as string);
        return;
      }
      replaceFilters(
        {
          search: searchInput,
          availability: filters.availability,
          hourlyRateRange: filters.hourlyRateRange,
          expertise: filters.expertise,
          [key]: value,
        },
        1,
      );
    },
    [
      replaceFilters,
      searchInput,
      filters.availability,
      filters.hourlyRateRange,
      filters.expertise,
    ],
  );

  const reset = React.useCallback(() => {
    setSearchInput("");
    router.replace("/vendors", { scroll: false });
  }, [router]);

  const uiFilters: VendorFilterState = {
    search: searchInput,
    availability: filters.availability,
    hourlyRateRange: filters.hourlyRateRange,
    expertise: filters.expertise ?? [],
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <VendorSubscriptionModal
        role={viewer?.role}
        subscription={viewer?.subscription}
        isProfileVisible={viewer?.isProfileVisible}
      />

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
            searchRef={searchRef}
          />
        </Reveal>

        {children}
      </div>
    </section>
  );
}

export { DEFAULT_FILTERS };
