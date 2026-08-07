import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Book } from "@/types";

/** Row of 5 stars filled to the (rounded) rating value. */
export function Stars({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const filled = Math.round(value);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${value} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < filled ? "fill-amber-400 text-amber-400" : "text-faint",
          )}
        />
      ))}
    </span>
  );
}

/** Ratings summary + individual reviews. */
export function BookReviews({ book }: { book: Book }) {
  const rating = book.rating;
  if (!rating) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-cloud">
        Ratings &amp; reviews
      </h2>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-hairline bg-white/2 px-5 py-4">
        <span className="font-display text-4xl font-bold text-cloud">
          {rating.average.toFixed(1)}
        </span>
        <div>
          <Stars value={rating.average} />
          <p className="mt-1 text-sm text-mist">
            {rating.totalReviews}{" "}
            {rating.totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {rating.reviews.map((review, i) => (
          <li
            key={`${review.reviewerName}-${i}`}
            className="rounded-2xl border border-hairline bg-white/2 px-5 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-cloud">{review.reviewerName}</p>
                <p className="text-xs text-faint">{review.reviewerTitle}</p>
              </div>
              <div className="text-right">
                <Stars value={review.rating} />
                <p className="mt-1 text-xs text-faint">{review.date}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              {review.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
