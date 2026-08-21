import type { EventType } from "@/types";
import { EVENT_TYPES } from "@/types";

export interface EventFilterState {
  search: string;
  type: string;
  featured: boolean;
}

export type EventListFilters = EventFilterState & {
  page: number;
  limit: number;
};

export const DEFAULT_EVENT_FILTERS: EventFilterState = {
  search: "",
  type: "",
  featured: false,
};

export function isEventType(value: string): value is EventType {
  return (EVENT_TYPES as string[]).includes(value);
}

export function buildEventsHref(
  filters: EventFilterState,
  page: number,
  limit: number,
) {
  const params = new URLSearchParams();
  const search = (filters.search ?? "").trim();
  if (search) params.set("searchTerm", search);
  if (filters.type) params.set("type", filters.type);
  if (filters.featured) params.set("isFeatured", "true");
  if (page > 1) params.set("page", String(page));
  if (limit !== 10) params.set("limit", String(limit));
  const qs = params.toString();
  return qs ? `/events?${qs}` : "/events";
}

export function buildEventApiQuery(filters: EventListFilters) {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  const search = (filters.search ?? "").trim();
  if (search) params.set("searchTerm", search);
  if (filters.type) params.set("type", filters.type);
  if (filters.featured) params.set("isFeatured", "true");
  return params.toString();
}
