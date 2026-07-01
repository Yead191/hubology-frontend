"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Box, LayoutGrid, MousePointerClick } from "lucide-react";

import type { Book } from "@/types";
import { cn } from "@/lib/utils";
import { getAllBooks } from "@/data/books";
import Loader from "@/components/layout/loader";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
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

export default function StoreExperience() {
  const books = React.useMemo(() => getAllBooks(), []);
  const [mode, setMode] = React.useState<Mode>("2d"); // SSR-safe default
  const [canUse3D, setCanUse3D] = React.useState(false);
  const [selected, setSelected] = React.useState<Book | null>(null);

  // Detect capability on the client; prefer 3D on capable desktops.
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        {/* Header */}
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-2xl">
            <span className="eyebrow">The Store</span>
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
              className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-hairline-strong bg-white/[0.03] p-1"
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

        {/* Experience */}
        <div className="mt-10">
          {mode === "3d" && canUse3D ? (
            <div className="border-gradient relative h-[62vh] min-h-112 overflow-hidden rounded-[2rem] bg-ink/60">
              <Gallery3D
                books={books}
                selectedSlug={selected?.slug ?? null}
                onSelect={setSelected}
                onDeselect={() => setSelected(null)}
              />

              {/* Hint */}
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

        {/* Always-available accessible catalogue */}
        <ul className="sr-only">
          {books.map((b) => (
            <li key={b.id}>
              <Link href={`/store/${b.slug}`}>
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
