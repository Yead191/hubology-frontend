"use client";

import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

import type { HubEvent, Pagination } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { EventCard } from "@/features/events/sections/event-card";
import {
  buildEventsHref,
  type EventListFilters,
} from "@/features/events/query";

export function EventGrid({
  events,
  pagination,
  filters,
}: {
  events: HubEvent[];
  pagination?: Pagination;
  filters: EventListFilters;
}) {
  const router = useRouter();

  function goToPage(page: number) {
    router.replace(buildEventsHref(filters, page, filters.limit), {
      scroll: false,
    });
  }

  if (events.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-hairline-strong bg-panel/30 px-6 py-16 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/4 text-faint">
          <SearchX className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-cloud">
          No events found
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-mist">
          Try a different search or clear your filters to see what&apos;s coming
          up next.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          <Reveal key={event._id} delay={Math.min(i * 60, 240)}>
            <EventCard event={event} />
          </Reveal>
        ))}
      </div>

      {pagination ? (
        <PaginationControls pagination={pagination} onPageChange={goToPage} />
      ) : null}
    </div>
  );
}

export function EventCardsSkeleton() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-hairline bg-panel/40"
        >
          <div className="aspect-16/10 animate-pulse bg-white/5" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-4/5 animate-pulse rounded bg-white/8" />
            <div className="h-4 w-full animate-pulse rounded bg-white/5" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
