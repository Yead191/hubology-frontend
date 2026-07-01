import Link from "next/link";
import { Star, Share2, ArrowRight } from "lucide-react";

import type { Book } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { BookCover2D } from "./book-cover";

/** 2D card for a book — used in the accessible / reduced-motion grid. */
export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/store/${book.slug}`}
      className="border-gradient group flex h-full flex-col rounded-3xl bg-panel/40 p-4 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:bg-panel/70 hover:glow-violet"
    >
      <BookCover2D
        book={book}
        className="w-full transition-transform duration-500 ease-out-soft group-hover:scale-[1.02]"
      />

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-display text-base font-semibold text-cloud">
          {book.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-mist">{book.subtitle}</p>

        <div className="mt-2 flex items-center gap-3 text-xs text-mist">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {book.rating.average}
          </span>
          <span className="inline-flex items-center gap-1">
            <Share2 className="h-3.5 w-3.5" />
            {book.shares.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
          <span className="font-display text-lg font-bold text-cloud">
            {formatPrice(book.price)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright">
            View
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Responsive grid of book cards. */
export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {books.map((book, i) => (
        <Reveal key={book.id} delay={(i % 4) * 70} className="h-full">
          <BookCard book={book} />
        </Reveal>
      ))}
    </div>
  );
}
