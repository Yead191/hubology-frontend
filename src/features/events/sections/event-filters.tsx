"use client";

import type { Ref } from "react";
import { Search, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { EVENT_TYPES, EVENT_TYPE_LABELS } from "@/types";
import { Input } from "@/components/ui/input";
import type { EventFilterState } from "@/features/events/query";

export function EventFilters({
  filters,
  onChange,
  onReset,
  searchRef,
}: {
  filters: EventFilterState;
  onChange: <K extends keyof EventFilterState>(
    key: K,
    value: EventFilterState[K],
  ) => void;
  onReset: () => void;
  searchRef?: Ref<HTMLInputElement>;
}) {
  const isFiltered =
    Boolean(filters.search?.trim()) ||
    Boolean(filters.type) ||
    filters.featured;

  return (
    <div className="border-gradient rounded-3xl bg-panel/40 p-4 sm:p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <Input
          ref={searchRef}
          value={filters.search ?? ""}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder="Search events by title, location, or tags…"
          aria-label="Search events"
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

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            active={!filters.type}
            onClick={() => onChange("type", "")}
          >
            All types
          </Chip>
          {EVENT_TYPES.map((type) => (
            <Chip
              key={type}
              active={filters.type === type}
              onClick={() =>
                onChange("type", filters.type === type ? "" : type)
              }
            >
              {EVENT_TYPE_LABELS[type]}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Chip
            active={filters.featured}
            onClick={() => onChange("featured", !filters.featured)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Featured only
          </Chip>

          {isFiltered ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-bright transition-colors hover:text-violet"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-transparent bg-brand-gradient text-white shadow-[0_8px_22px_-10px_rgba(129,49,240,0.9)]"
          : "border-hairline-strong bg-white/2 text-mist hover:bg-white/6 hover:text-cloud",
      )}
    >
      {children}
    </button>
  );
}
