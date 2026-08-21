import type { Metadata } from "next";
import { Suspense } from "react";

import EventsExperience from "@/features/events";
import { EventResults } from "@/features/events/sections/event-results";
import { EventCardsSkeleton } from "@/features/events/sections/event-grid";
import {
  isEventType,
  type EventListFilters,
} from "@/features/events/query";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Events & Workshops",
  description:
    "Explore Hubology workshops, meetups, conferences, and community events. Filter by type and find your next opportunity to learn and connect.",
  path: "/events",
  keywords: [
    "Hubology events",
    "founder workshops",
    "startup networking",
    "business meetups",
    "conference calendar",
  ],
});

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
    type?: string;
    isFeatured?: string;
    page?: string;
    limit?: string;
  }>;
}

function parseFilters(
  sp: Awaited<PageProps["searchParams"]>,
): EventListFilters {
  const type = sp.type?.trim() ?? "";
  return {
    search: sp.searchTerm?.trim() ?? "",
    type: type && isEventType(type) ? type : "",
    featured:
      sp.isFeatured === "true" ||
      sp.isFeatured === "1" ||
      sp.isFeatured === "yes",
    page: Math.max(1, Number(sp.page) || 1),
    limit: Math.max(1, Number(sp.limit) || 10),
  };
}

export default async function EventsPage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams);

  return (
    <EventsExperience filters={filters}>
      <Suspense fallback={<EventCardsSkeleton />}>
        <EventResults filters={filters} />
      </Suspense>
    </EventsExperience>
  );
}
