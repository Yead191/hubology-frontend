import type { Metadata } from "next";
import { Suspense } from "react";

import type { Book, Pagination } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import StoreExperience, {
  type StoreFilters,
} from "@/features/store";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Step into the Hubology 3D bookstore — a shelf of founder-built books. Browse in 3D, then buy and download.",
};

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
    limit?: string;
  }>;
}

function parseFilters(
  sp: Awaited<PageProps["searchParams"]>,
): StoreFilters {
  return {
    searchTerm: sp.searchTerm?.trim() ?? "",
    page: Math.max(1, Number(sp.page) || 1),
    limit: Math.max(1, Number(sp.limit) || 10),
  };
}

function buildQuery(filters: StoreFilters) {
  const params = new URLSearchParams();
  params.set("type", "digital");
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  const search = (filters.searchTerm ?? "").trim();
  if (search) params.set("searchTerm", search);
  return params.toString();
}

export default async function StorePage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams);

  return (
    <Suspense fallback={<StoreSkeleton />}>
      <StoreLoader filters={filters} />
    </Suspense>
  );
}

async function StoreLoader({ filters }: { filters: StoreFilters }) {
  const qs = buildQuery(filters);
  const res = await nextFetch<Book[]>(`/books?${qs}`, {
    method: "GET",
    cache: "no-store",
  });

  const books = res.success ? (res.data ?? []) : [];
  const pagination: Pagination | undefined = res.pagination;

  return (
    <StoreExperience books={books} pagination={pagination} filters={filters} />
  );
}

function StoreSkeleton() {
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
              className="border-gradient aspect-2/3 animate-pulse rounded-3xl bg-panel/40"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
