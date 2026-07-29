"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Pagination } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Compact page controls for paginated lists (store, vendors, etc.). */
export function PaginationControls({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  const { page, totalPage, total } = pagination;
  if (totalPage <= 1) return null;

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-mist">
        Page <span className="font-semibold text-cloud">{page}</span> of{" "}
        <span className="font-semibold text-cloud">{totalPage}</span>
        <span className="text-faint"> · {total} total</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition-colors",
                p === page
                  ? "bg-brand-gradient text-white"
                  : "text-mist hover:bg-white/6 hover:text-cloud",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPage}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
