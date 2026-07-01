"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";

import {
  expertiseOptions,
  hourlyRateOptions,
  availabilityOptions,
} from "@/lib/validators";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortKey = "rating" | "reviews" | "rate-asc" | "rate-desc";

export interface VendorFilterState {
  query: string;
  expertise: string;
  rate: string;
  availability: string;
  sort: SortKey;
}

export const DEFAULT_FILTERS: VendorFilterState = {
  query: "",
  expertise: "all",
  rate: "all",
  availability: "all",
  sort: "rating",
};

const SORT_LABELS: Record<SortKey, string> = {
  rating: "Top rated",
  reviews: "Most reviews",
  "rate-asc": "Rate: low to high",
  "rate-desc": "Rate: high to low",
};

/** Search + faceted filters + sort for the vendors directory. */
export function VendorFilters({
  filters,
  onChange,
  onReset,
  resultCount,
}: {
  filters: VendorFilterState;
  onChange: <K extends keyof VendorFilterState>(
    key: K,
    value: VendorFilterState[K],
  ) => void;
  onReset: () => void;
  resultCount: number;
}) {
  const isFiltered =
    filters.query !== "" ||
    filters.expertise !== "all" ||
    filters.rate !== "all" ||
    filters.availability !== "all";

  return (
    <div className="border-gradient rounded-3xl bg-panel/40 p-4 sm:p-5">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <Input
          value={filters.query}
          onChange={(e) => onChange("query", e.target.value)}
          placeholder="Search by name, role, company, or expertise…"
          aria-label="Search vendors"
          className="pl-11 pr-10"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => onChange("query", "")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-faint transition-colors hover:bg-white/[0.06] hover:text-cloud"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Facets */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FacetSelect
          label="Expertise"
          value={filters.expertise}
          onValueChange={(v) => onChange("expertise", v)}
          placeholder="All expertise"
          options={expertiseOptions}
        />
        <FacetSelect
          label="Rate"
          value={filters.rate}
          onValueChange={(v) => onChange("rate", v)}
          placeholder="Any rate"
          options={hourlyRateOptions}
        />
        <FacetSelect
          label="Availability"
          value={filters.availability}
          onValueChange={(v) => onChange("availability", v)}
          placeholder="Any availability"
          options={availabilityOptions}
        />

        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 pl-1 text-xs font-medium text-faint">
            <SlidersHorizontal className="h-3 w-3" /> Sort
          </span>
          <Select
            value={filters.sort}
            onValueChange={(v) => onChange("sort", v as SortKey)}
          >
            <SelectTrigger aria-label="Sort vendors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Result meta */}
      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
        <span className="text-sm text-mist">
          <span className="font-semibold text-cloud">{resultCount}</span>{" "}
          {resultCount === 1 ? "expert" : "experts"}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-bright transition-colors hover:text-violet"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function FacetSelect({
  label,
  value,
  onValueChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="pl-1 text-xs font-medium text-faint">{label}</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
