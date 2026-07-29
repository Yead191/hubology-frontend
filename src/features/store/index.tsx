"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  LayoutGrid,
  MousePointerClick,
  Search,
  SearchX,
  X,
} from "lucide-react";

import type { Book, Pagination } from "@/types";
import { cn } from "@/lib/utils";
import { bookHref, bookId } from "@/lib/book";
import Loader from "@/components/layout/loader";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { BookGrid } from "@/features/store/sections/book-grid";
import { QuickLook } from "@/features/store/sections/quick-look";

// The 3D canvas is heavy + browser-only: code-split and never SSR it.
const Gallery3D = dynamic(
  () => import("@/features/store/sections/gallery-3d"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center">
        <Loader fullscreen={false} label="Entering the store…" />
      </div>
    ),
  },
);

type Mode = "3d" | "2d";

export interface StoreFilters {
  searchTerm: string;
  page: number;
  limit: number;
}

interface StoreExperienceProps {
  books: Book[];
  pagination?: Pagination;
  filters: StoreFilters;
}

function buildStoreHref(filters: StoreFilters) {
  const params = new URLSearchParams();
  const search = (filters.searchTerm ?? "").trim();
  if (search) params.set("searchTerm", search);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.limit !== 10) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `/store?${qs}` : "/store";
}

export default function StoreExperience({
  books,
  pagination,
  filters,
}: StoreExperienceProps) {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("2d");
  const [canUse3D, setCanUse3D] = React.useState(false);
  const [selected, setSelected] = React.useState<Book | null>(null);
  const [searchInput, setSearchInput] = React.useState(
    filters.searchTerm ?? "",
  );

  React.useEffect(() => {
    setSearchInput(filters.searchTerm ?? "");
  }, [filters.searchTerm]);

  React.useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    const ok = webgl && !reduce;
    setCanUse3D(ok);
    if (ok && !small) setMode("3d");
  }, []);

  const push = React.useCallback(
    (next: Partial<StoreFilters>) => {
      router.push(
        buildStoreHref({
          searchTerm: next.searchTerm ?? filters.searchTerm,
          page: next.page ?? 1,
          limit: next.limit ?? filters.limit,
        }),
      );
    },
    [router, filters.searchTerm, filters.limit],
  );

  // Debounce search → URL.
  React.useEffect(() => {
    if (searchInput === (filters.searchTerm ?? "")) return;
    const timer = setTimeout(() => {
      push({ searchTerm: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, filters.searchTerm, push]);

  const switchMode = (next: Mode) => {
    setSelected(null);
    setMode(next);
  };

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
              Step into the <span className="text-gradient">bookstore</span>
            </h1>
            <p className="mt-3 text-pretty text-mist">
              A shelf of founder-built books. Drag to look around, click a cover
              to take a closer look, then open it for the full story.
            </p>
          </header>

          {canUse3D && (
            <div
              role="tablist"
              aria-label="Store view"
              className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-hairline-strong bg-white/3 p-1"
            >
              <ModeButton
                active={mode === "3d"}
                onClick={() => switchMode("3d")}
                icon={<Box className="h-4 w-4" />}
                label="3D store"
              />
              <ModeButton
                active={mode === "2d"}
                onClick={() => switchMode("2d")}
                icon={<LayoutGrid className="h-4 w-4" />}
                label="Simple view"
              />
            </div>
          )}
        </Reveal>

        {/* Search */}
        {/* <Reveal delay={60} className="mt-8">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search books…"
              aria-label="Search books"
              className="pl-11 pr-10"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  push({ searchTerm: "", page: 1 });
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-faint transition-colors hover:bg-white/6 hover:text-cloud"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </Reveal> */}

        <div className="mt-8">
          {books.length === 0 ? (
            <Reveal className="border-gradient flex flex-col items-center rounded-3xl bg-panel/30 px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/4 text-violet-bright">
                <SearchX className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-cloud">
                No books found
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-mist">
                Try a different search term, or clear the filter to see the full
                shelf.
              </p>
            </Reveal>
          ) : mode === "3d" && canUse3D ? (
            <div className="border-gradient relative h-[62vh] min-h-112 overflow-hidden rounded-4xl bg-ink/60">
              <Gallery3D
                books={books?.slice(0, 5) ?? []}
                selectedId={selected ? bookId(selected) : null}
                onSelect={setSelected}
                onDeselect={() => setSelected(null)}
              />

              {!selected && (
                <div className="pointer-events-none absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full border border-hairline-strong bg-ink/70 px-4 py-1.5 text-xs text-mist backdrop-blur-md">
                  <MousePointerClick className="h-3.5 w-3.5 text-violet-bright" />
                  Drag to look around · click a book
                </div>
              )}

              {selected && (
                <QuickLook book={selected} onClose={() => setSelected(null)} />
              )}
            </div>
          ) : (
            <BookGrid books={books} />
          )}
        </div>

        {pagination ? (
          <PaginationControls
            pagination={pagination}
            onPageChange={(page) => push({ searchTerm: searchInput, page })}
          />
        ) : null}

        <ul className="sr-only">
          {books.map((b) => (
            <li key={bookId(b)}>
              <Link href={bookHref(b)}>
                {b.title} — {b.subtitle}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-brand-gradient text-white shadow-[0_8px_22px_-10px_rgba(129,49,240,0.9)]"
          : "text-mist hover:text-cloud",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
