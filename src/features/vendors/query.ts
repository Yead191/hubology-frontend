import type { VendorFilterState } from "@/features/vendors/sections/vendor-filters";

export type VendorListFilters = VendorFilterState & {
  page: number;
  limit: number;
};

function appendExpertise(
  params: URLSearchParams,
  expertise: string[] | undefined,
) {
  for (const item of expertise ?? []) {
    const value = item.trim();
    if (value) params.append("expertise[]", value);
  }
}

export function buildVendorsHref(
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
  appendExpertise(params, filters.expertise);
  if (page > 1) params.set("page", String(page));
  if (limit !== 10) params.set("limit", String(limit));
  const qs = params.toString();
  return qs ? `/vendors?${qs}` : "/vendors";
}

export function buildVendorApiQuery(filters: VendorListFilters) {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  const search = (filters.search ?? "").trim();
  if (search) params.set("searchTerm", search);
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.hourlyRateRange) {
    params.set("hourlyRateRange", filters.hourlyRateRange);
  }
  appendExpertise(params, filters.expertise);
  return params.toString();
}
