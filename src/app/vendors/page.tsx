import type { Metadata } from "next";
import { Suspense } from "react";

import type { Pagination, Vendor } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import Vendors from "@/features/vendors";
import type { VendorFilterState } from "@/features/vendors/sections/vendor-filters";
import getProfile from "@/helpers/next-fetch/getProfile";

export const metadata: Metadata = {
  title: "Vendors",
  description:
    "Browse Hubology's directory of manually-verified experts. Search and filter by expertise, rate, and availability, then reach out directly.",
};

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
    availability?: string;
    hourlyRateRange?: string;
    page?: string;
    limit?: string;
  }>;
}

function parseFilters(
  sp: Awaited<PageProps["searchParams"]>,
): VendorFilterState & { page: number; limit: number } {
  return {
    search: sp.searchTerm?.trim() ?? "",
    availability: sp.availability?.trim() ?? "",
    hourlyRateRange: sp.hourlyRateRange?.trim() ?? "",
    page: Math.max(1, Number(sp.page) || 1),
    limit: Math.max(1, Number(sp.limit) || 10),
  };
}

function buildQuery(
  filters: VendorFilterState & { page: number; limit: number },
) {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  const search = (filters.search ?? "").trim();
  if (search) params.set("searchTerm", search);
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.hourlyRateRange) {
    params.set("hourlyRateRange", filters.hourlyRateRange);
  }
  return params.toString();
}

export default async function VendorsPage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams);

  return (
    <Suspense fallback={<VendorsSkeleton />}>
      <VendorsLoader filters={filters} />
    </Suspense>
  );
}

async function VendorsLoader({
  filters,
}: {
  filters: VendorFilterState & { page: number; limit: number };
}) {
  const qs = buildQuery(filters);

  const [res, profile] = await Promise.all([
    nextFetch<Vendor[]>(`/vendor?${qs}`, {
      method: "GET",
      cache: "no-store",
    }),
    getProfile(),
  ]);

  const vendors = res.success ? (res.data ?? []) : [];
  const pagination: Pagination | undefined = res.pagination;

  return (
    <Vendors
      vendors={vendors}
      pagination={pagination}
      filters={filters}
      viewer={
        profile
          ? {
              role: profile.role,
              subscription: profile.subscription ?? null,
            }
          : null
      }
    />
  );
}

function VendorsSkeleton() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-10 w-72 animate-pulse rounded-md bg-white/8" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-md bg-white/5" />
        <div className="border-gradient mt-10 h-40 animate-pulse rounded-3xl bg-panel/40" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-gradient h-72 animate-pulse rounded-3xl bg-panel/40"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
