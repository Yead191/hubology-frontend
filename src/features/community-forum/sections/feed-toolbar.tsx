"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ForumCategory } from "@/types";
import { FORUM_CATEGORIES } from "@/data/forum";

export type CategoryFilter = ForumCategory | "All";

/** Search box + horizontally-scrollable category filter chips. */
export function FeedToolbar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  category: CategoryFilter;
  onCategoryChange: (c: CategoryFilter) => void;
}) {
  return (
    <div className="border-gradient rounded-3xl bg-panel/40 p-3 sm:p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search posts, people, topics…"
          aria-label="Search the forum"
          className={cn(
            "h-11 w-full rounded-full border border-input bg-white/[0.03] pl-11 pr-10 text-sm text-cloud transition-colors",
            "placeholder:text-faint focus-visible:outline-none focus-visible:border-violet/60 focus-visible:ring-2 focus-visible:ring-violet/25",
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-faint transition-colors hover:bg-white/6 hover:text-cloud"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        <Chip
          active={category === "All"}
          onClick={() => onCategoryChange("All")}
        >
          All
        </Chip>
        {FORUM_CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Chip
              key={c.value}
              active={category === c.value}
              onClick={() => onCategoryChange(c.value)}
            >
              <Icon className="h-3.5 w-3.5" />
              {c.label}
            </Chip>
          );
        })}
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
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-transparent bg-brand-gradient text-white shadow-[0_8px_22px_-10px_rgba(129,49,240,0.9)]"
          : "border-hairline-strong bg-white/[0.02] text-mist hover:bg-white/[0.06] hover:text-cloud",
      )}
    >
      {children}
    </button>
  );
}
