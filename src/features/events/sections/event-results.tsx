import type { HubEvent, Pagination } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { EventGrid } from "@/features/events/sections/event-grid";
import {
  buildEventApiQuery,
  type EventListFilters,
} from "@/features/events/query";

export async function EventResults({
  filters,
}: {
  filters: EventListFilters;
}) {
  const res = await nextFetch<HubEvent[]>(
    `/event?${buildEventApiQuery(filters)}`,
    { method: "GET", cache: "no-store" },
  );

  const events = res.success ? (res.data ?? []) : [];
  const pagination: Pagination | undefined = res.pagination;

  return (
    <EventGrid events={events} pagination={pagination} filters={filters} />
  );
}
