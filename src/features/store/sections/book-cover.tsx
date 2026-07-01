import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Book } from "@/types";

/**
 * 2D representation of a book cover. Uses the real image when present,
 * otherwise renders a procedural brand-gradient cover with the title —
 * matching the look of the 3D shelf.
 */
export function BookCover2D({
  book,
  className,
  sizes = "(max-width: 768px) 50vw, 300px",
  priority = false,
}: {
  book: Book;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-2/3 overflow-hidden rounded-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {book.coverImage ? (
        <Image
          src={book.coverImage}
          alt={`${book.title} cover`}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      ) : (
        <ProceduralCover book={book} />
      )}
      {/* Spine sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"
      />
    </div>
  );
}

function ProceduralCover({ book }: { book: Book }) {
  const [from, to] = book.accent;
  return (
    <div
      className="flex h-full w-full flex-col justify-between p-4"
      style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}
    >
      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70">
        Hubology
      </span>
      <div>
        <h3 className="font-display text-lg font-bold leading-tight text-white">
          {book.title}
        </h3>
        <p className="mt-1.5 text-[11px] leading-snug text-white/75">
          {book.subtitle}
        </p>
      </div>
      <span
        aria-hidden
        className="h-0.5 w-10 rounded-full bg-white/60"
      />
    </div>
  );
}
