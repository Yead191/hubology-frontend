"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, SearchX, X } from "lucide-react";

import type { Book, Pagination } from "@/types";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ProductGrid } from "@/features/office-supplies/sections/product-grid";

export interface OfficeFilters {
  searchTerm: string;
  page: number;
  limit: number;
}

interface OfficeSuppliesExperienceProps {
  products: Book[];
  pagination?: Pagination;
  filters: OfficeFilters;
}

function buildOfficeHref(filters: OfficeFilters) {
  const params = new URLSearchParams();
  const search = (filters.searchTerm ?? "").trim();
  if (search) params.set("searchTerm", search);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.limit !== 10) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `/office-supplies?${qs}` : "/office-supplies";
}

export default function OfficeSuppliesExperience({
  products,
  pagination,
  filters,
}: OfficeSuppliesExperienceProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = React.useState(
    filters.searchTerm ?? "",
  );

  React.useEffect(() => {
    setSearchInput(filters.searchTerm ?? "");
  }, [filters.searchTerm]);

  const push = React.useCallback(
    (next: Partial<OfficeFilters>) => {
      router.push(
        buildOfficeHref({
          searchTerm: next.searchTerm ?? filters.searchTerm,
          page: next.page ?? 1,
          limit: next.limit ?? filters.limit,
        }),
      );
    },
    [router, filters.searchTerm, filters.limit],
  );

  React.useEffect(() => {
    if (searchInput === (filters.searchTerm ?? "")) return;
    const timer = setTimeout(() => {
      push({ searchTerm: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, filters.searchTerm, push]);

  const hasResults = products.length > 0;

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-2xl">
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
              Office <span className="text-gradient">Supplies</span>
            </h1>
            <p className="mt-3 text-pretty text-mist">
              Premium physical goods designed to keep founders organized and
              focused on what matters most. From notebooks to vision boards,
              equip your office with the best tools.
            </p>
          </header>

          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <Input
              type="search"
              placeholder="Search products..."
              className="border-hairline-strong bg-white/5 pl-9 pr-9 focus:border-violet-bright"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput ? (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-cloud"
                onClick={() => {
                  setSearchInput("");
                  push({ searchTerm: "", page: 1 });
                }}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-10">
          {hasResults ? (
            <>
              <ProductGrid products={products} />
              {pagination && pagination.totalPage > 1 ? (
                <PaginationControls
                  pagination={pagination}
                  onPageChange={(page) => push({ page })}
                />
              ) : null}
            </>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-hairline-strong bg-panel/30">
              <SearchX className="mb-3 h-8 w-8 text-faint" />
              <p className="text-mist">
                {filters.searchTerm
                  ? `No products found for “${filters.searchTerm}”`
                  : "No office supplies available yet."}
              </p>
              {filters.searchTerm ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    push({ searchTerm: "", page: 1 });
                  }}
                  className="mt-4 text-sm text-violet-bright hover:underline"
                >
                  Clear search
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
