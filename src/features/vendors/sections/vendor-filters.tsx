"use client";

import type { Ref } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  hourlyRateOptions,
  availabilityOptions,
  expertiseOptions,
} from "@/lib/validators";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface VendorFilterState {
  search: string;
  hourlyRateRange: string;
  availability: string;
  expertise: string[];
}

export const DEFAULT_FILTERS: VendorFilterState = {
  search: "",
  hourlyRateRange: "",
  availability: "",
  expertise: [],
};

/** Search + faceted filters for the vendors directory (URL-driven). */
export function VendorFilters({
  filters,
  onChange,
  onReset,
  searchRef,
}: {
  filters: VendorFilterState;
  onChange: <K extends keyof VendorFilterState>(
    key: K,
    value: VendorFilterState[K],
  ) => void;
  onReset: () => void;
  searchRef?: Ref<HTMLInputElement>;
}) {
  const selectedExpertise = filters.expertise ?? [];
  const isFiltered =
    Boolean(filters.search?.trim()) ||
    Boolean(filters.hourlyRateRange) ||
    Boolean(filters.availability) ||
    selectedExpertise.length > 0;

  function toggleExpertise(opt: string) {
    const next = selectedExpertise.includes(opt)
      ? selectedExpertise.filter((item) => item !== opt)
      : [...selectedExpertise, opt];
    onChange("expertise", next);
  }

  return (
    <div className="border-gradient rounded-3xl bg-panel/40 p-4 sm:p-5">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <Input
          ref={searchRef}
          value={filters.search ?? ""}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder="Search by name, company, or expertise…"
          aria-label="Search vendors"
          className="pl-11 pr-10"
        />
        {filters.search ? (
          <button
            type="button"
            onClick={() => onChange("search", "")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-faint transition-colors hover:bg-white/6 hover:text-cloud"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Facets */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <FacetSelect
          label="Rate"
          value={filters.hourlyRateRange}
          onValueChange={(v) => onChange("hourlyRateRange", v)}
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
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <span className="pl-1 text-xs font-medium text-faint">Expertise</span>
        <div className="flex flex-wrap gap-2">
          {expertiseOptions.map((opt) => {
            const active = selectedExpertise.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={active}
                onClick={() => toggleExpertise(opt)}
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-transparent bg-brand-gradient text-white shadow-[0_8px_22px_-10px_rgba(129,49,240,0.9)]"
                    : "border-hairline-strong bg-white/2 text-mist hover:bg-white/6 hover:text-cloud",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {isFiltered ? (
        <div className="mt-4 flex items-center justify-end border-t border-hairline pt-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-bright transition-colors hover:text-violet"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Radix Select disallows empty-string item values, so "any" uses a sentinel. */
const ANY_VALUE = "__any__";

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
  options: readonly string[] | readonly { key: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="pl-1 text-xs font-medium text-faint">{label}</span>
      <Select
        value={value || undefined}
        onValueChange={(v) => onValueChange(v === ANY_VALUE ? "" : v)}
      >
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY_VALUE}>{placeholder}</SelectItem>
          {options.map((opt) => {
            const k = typeof opt === "string" ? opt : opt.key;
            const v = typeof opt === "string" ? opt : opt.value;
            return (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
