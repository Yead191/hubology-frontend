"use client";

import Link from "next/link";
import { Star, Share2, X, ArrowRight } from "lucide-react";

import type { Book } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookCover2D } from "./book-cover";

/** Floating quick-look panel for the book selected in the 3D gallery. */
export function QuickLook({
  book,
  onClose,
}: {
  book: Book;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-4 sm:p-6">
      <div className="loader-in glass-dark pointer-events-auto flex w-full max-w-md items-center gap-4 rounded-3xl border border-hairline-strong p-3 pr-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
        <BookCover2D book={book} sizes="80px" className="w-16 shrink-0" />

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold text-cloud">
            {book.title}
          </h3>
          <p className="truncate text-xs text-mist">{book.subtitle}</p>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-mist">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {book.rating.average}
            </span>
            <span className="inline-flex items-center gap-1">
              <Share2 className="h-3.5 w-3.5" />
              {book.shares.toLocaleString()}
            </span>
            <span className="font-semibold text-cloud">
              {formatPrice(book.price)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="grid h-7 w-7 place-items-center rounded-full text-faint transition-colors hover:bg-white/[0.06] hover:text-cloud"
          >
            <X className="h-4 w-4" />
          </button>
          <Button asChild size="sm">
            <Link href={`/store/${book.slug}`}>
              Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
