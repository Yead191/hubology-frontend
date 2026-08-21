import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Sparkles } from "lucide-react";

import type { HubEvent } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  eventTypeLabel,
  formatEventRange,
} from "@/features/events/helpers";

export function EventCard({ event }: { event: HubEvent }) {
  const cover = getImageUrl(event.coverImage);
  const href = `/events/${event.slug}`;
  const tags = (event.tags ?? []).slice(0, 3);

  return (
    <article className="border-gradient group flex h-full flex-col overflow-hidden rounded-3xl bg-panel/40 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:bg-panel/70 hover:glow-violet">
      <Link href={href} className="relative block aspect-16/10 overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-violet/30 via-panel to-ink" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-ink/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cloud backdrop-blur-md">
            {eventTypeLabel(event.type)}
          </span>
          {event.isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet/25 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-bright backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold leading-snug text-cloud">
          <Link href={href} className="transition-colors hover:text-violet-bright">
            {event.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-mist">
          {event.shortDescription || event.description || "Details coming soon."}
        </p>

        <div className="mt-4 space-y-2 text-sm text-mist">
          <p className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-violet-bright" />
            <span>{formatEventRange(event)}</span>
          </p>
          {event.location ? (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-bright" />
              <span className="line-clamp-2">{event.location}</span>
            </p>
          ) : null}
        </div>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-hairline bg-white/3 px-2.5 py-0.5 text-xs text-mist"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-5">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-bright transition-colors hover:text-violet"
          >
            View event
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
