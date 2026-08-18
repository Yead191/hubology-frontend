import type { Pagination, Vendor } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { VendorGrid } from "@/features/vendors/sections/vendor-grid";
import {
  buildVendorApiQuery,
  type VendorListFilters,
} from "@/features/vendors/query";

export async function VendorResults({
  filters,
}: {
  filters: VendorListFilters;
}) {
  const res = await nextFetch<Vendor[]>(`/vendor?${buildVendorApiQuery(filters)}`, {
    method: "GET",
    cache: "default",
  });

  const vendors = res.success ? (res.data ?? []) : [];
  const pagination: Pagination | undefined = res.pagination;

  return (
    <VendorGrid vendors={vendors} pagination={pagination} filters={filters} />
  );
}
