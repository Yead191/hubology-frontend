"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { EventFilters } from "@/features/events/sections/event-filters";
import {
  DEFAULT_EVENT_FILTERS,
  buildEventsHref,
  type EventFilterState,
  type EventListFilters,
} from "@/features/events/query";

export default function EventsExperience({
  filters,
  children,
}: {
  filters: EventListFilters;
  children: React.ReactNode;
}) {
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
    (next: EventFilterState, page = 1) => {
      router.replace(buildEventsHref(next, page, filters.limit), {
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
          type: filters.type,
          featured: filters.featured,
        },
        1,
      );
      requestAnimationFrame(() => searchRef.current?.focus());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, filters, replaceFilters]);

  const update = React.useCallback(
    <K extends keyof EventFilterState>(
      key: K,
      value: EventFilterState[K],
    ) => {
      if (key === "search") {
        keepSearchFocus.current = true;
        setSearchInput(value as string);
        return;
      }
      replaceFilters(
        {
          search: searchInput,
          type: filters.type,
          featured: filters.featured,
          [key]: value,
        },
        1,
      );
    },
    [replaceFilters, searchInput, filters.type, filters.featured],
  );

  const reset = React.useCallback(() => {
    setSearchInput("");
    router.replace("/events", { scroll: false });
  }, [router]);

  const uiFilters: EventFilterState = {
    search: searchInput,
    type: filters.type,
    featured: filters.featured,
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <header className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">
              Community calendar
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
              Explore running{" "}
              <span className="text-gradient">Hubology events</span>
            </h1>
            <p className="mt-3 text-pretty text-mist">
              Workshops, meetups, and conferences — filter by type, search by
              topic, and find your next room to grow in.
            </p>
          </header>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <EventFilters
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

export { DEFAULT_EVENT_FILTERS };
