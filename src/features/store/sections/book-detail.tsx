import Link from "next/link";
import { ArrowLeft, Share2, Building2, CalendarDays, BookOpen, Layers } from "lucide-react";

import type { Book } from "@/types";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { BookCover2D } from "./book-cover";
import { Stars, BookReviews } from "./book-reviews";
import { BookBuyPanel } from "./book-buy-panel";

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-white/[0.02] px-4 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-faint">{label}</p>
        <p className="truncate text-sm font-medium text-cloud">{value}</p>
      </div>
    </div>
  );
}

/** Full book detail page: overview, details, reviews, buy/download. */
export function BookDetail({ book }: { book: Book }) {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora animated className="-top-16 right-0 h-112 w-xl opacity-35" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
            <Link href="/store">
              <ArrowLeft className="h-4 w-4" /> Back to store
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Main */}
          <div className="flex flex-col gap-10">
            {/* Hero */}
            <Reveal className="flex flex-col gap-6 sm:flex-row sm:gap-8">
              <BookCover2D
                book={book}
                priority
                sizes="(max-width: 640px) 60vw, 220px"
                className="w-44 shrink-0 self-center sm:self-start"
              />
              <div className="flex flex-col gap-3">
                <h1 className="font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
                  {book.title}
                </h1>
                <p className="text-lg text-mist">{book.subtitle}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-mist">
                  <span className="inline-flex items-center gap-1.5">
                    <Stars value={book.rating.average} />
                    <span className="text-cloud">{book.rating.average.toFixed(1)}</span>
                    <span className="text-faint">
                      ({book.rating.totalReviews})
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Share2 className="h-4 w-4" />
                    {book.shares.toLocaleString()} shares
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-mist/90">
                  {book.description}
                </p>
              </div>
            </Reveal>

            {/* Details */}
            <Reveal delay={80}>
              <h2 className="text-lg font-semibold text-cloud">Details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailRow
                  icon={Building2}
                  label="Publisher"
                  value={book.details.publisher}
                />
                <DetailRow
                  icon={CalendarDays}
                  label="First published"
                  value={book.details.firstPublish}
                />
                <DetailRow
                  icon={Layers}
                  label="Edition"
                  value={book.details.edition}
                />
                <DetailRow
                  icon={BookOpen}
                  label="Pages"
                  value={`${book.details.pages} pages`}
                />
              </div>
            </Reveal>

            {/* Reviews */}
            <Reveal delay={120}>
              <BookReviews book={book} />
            </Reveal>
          </div>

          {/* Buy rail */}
          <Reveal delay={100} className="lg:sticky lg:top-28">
            <BookBuyPanel book={book} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
