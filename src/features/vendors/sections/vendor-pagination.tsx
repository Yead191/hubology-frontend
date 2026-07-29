"use client";

import type { Pagination } from "@/types";
import { PaginationControls } from "@/components/ui/pagination-controls";

/** @deprecated Prefer PaginationControls — kept for existing imports. */
export function VendorPagination({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  return (
    <PaginationControls pagination={pagination} onPageChange={onPageChange} />
  );
}
