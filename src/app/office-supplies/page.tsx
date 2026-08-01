import type { Metadata } from "next";
import { Suspense } from "react";

import type { Book, Pagination } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import OfficeSuppliesExperience, {
  type OfficeFilters,
} from "@/features/office-supplies";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Office Supplies for Founders",
  description:
    "Shop premium office supplies and founder essentials from Hubology — organized tools and physical products that keep your workspace focused on growth.",
  path: "/office-supplies",
  keywords: [
    "founder office supplies",
    "entrepreneur workspace essentials",
    "premium office products",
    "startup office supplies online",
    "business stationery and tools",
  ],
});

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
    limit?: string;
  }>;
}

function parseFilters(
  sp: Awaited<PageProps["searchParams"]>,
): OfficeFilters {
  return {
    searchTerm: sp.searchTerm?.trim() ?? "",
    page: Math.max(1, Number(sp.page) || 1),
    limit: Math.max(1, Number(sp.limit) || 10),
  };
}

function buildQuery(filters: OfficeFilters) {
  const params = new URLSearchParams();
  params.set("type", "office");
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  const search = (filters.searchTerm ?? "").trim();
  if (search) params.set("searchTerm", search);
  return params.toString();
}

export default async function OfficeSuppliesPage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams);

  return (
    <Suspense fallback={<OfficeSkeleton />}>
      <OfficeLoader filters={filters} />
    </Suspense>
  );
}

async function OfficeLoader({ filters }: { filters: OfficeFilters }) {
  const qs = buildQuery(filters);
  const res = await nextFetch<Book[]>(`/books?${qs}`, {
    method: "GET",
    cache: "no-store",
  });

  const products = res.success ? (res.data ?? []) : [];
  const pagination: Pagination | undefined = res.pagination;

  return (
    <OfficeSuppliesExperience
      products={products}
      pagination={pagination}
      filters={filters}
    />
  );
}

function OfficeSkeleton() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-10 w-72 animate-pulse rounded-md bg-white/8" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-md bg-white/5" />
        <div className="mt-8 h-12 w-full max-w-md animate-pulse rounded-xl bg-white/5" />
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border-gradient aspect-4/5 animate-pulse rounded-3xl bg-panel/40"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
