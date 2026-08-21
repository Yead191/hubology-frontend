"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import type { HubEvent } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import {
  eventTypeLabel,
  formatEventDate,
  formatEventRange,
  formatEventTime,
  isUpcoming,
} from "@/features/events/helpers";

export function EventDetail({ event }: { event: HubEvent }) {
  const cover = getImageUrl(event.coverImage);
  const gallery = React.useMemo(
    () =>
      (event.images ?? [])
        .map((src) => getImageUrl(src))
        .filter((src): src is string => Boolean(src)),
    [event.images],
  );
  const [activeImage, setActiveImage] = React.useState<string | undefined>(
    cover || gallery[0],
  );
  const upcoming = isUpcoming(event);
  const org = event.organization;

  React.useEffect(() => {
    setActiveImage(cover || gallery[0]);
  }, [event._id, cover, gallery]);

  const thumbs = React.useMemo(() => {
    const set = new Set<string>();
    if (cover) set.add(cover);
    for (const g of gallery) set.add(g);
    return [...set];
  }, [cover, gallery]);

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <Aurora
        animated
        className="-top-16 left-1/2 h-140 w-200 -translate-x-1/2 opacity-35"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
            <Link href="/events">
              <ArrowLeft className="h-4 w-4" />
              All events
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
          {/* Media column */}
          <Reveal>
            <div className="space-y-4">
              <div className="relative aspect-16/10 overflow-hidden rounded-[1.75rem] border border-hairline-strong bg-panel/50">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={event.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-violet/25 via-panel to-ink" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/15 bg-ink/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cloud backdrop-blur-md">
                    {eventTypeLabel(event.type)}
                  </span>
                  {event.isFeatured ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-violet/35 bg-violet/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-bright backdrop-blur-md">
                      <Sparkles className="h-3.5 w-3.5" />
                      Featured
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-md ${
                      upcoming
                        ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-300"
                        : "border-hairline bg-ink/55 text-mist"
                    }`}
                  >
                    {upcoming ? "Upcoming" : "Past"}
                  </span>
                </div>
              </div>

              {thumbs.length > 1 ? (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {thumbs.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(src)}
                      className={`relative h-18 w-28 shrink-0 overflow-hidden rounded-xl border transition-all ${
                        activeImage === src
                          ? "border-violet-bright ring-2 ring-violet/40"
                          : "border-hairline opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>

          {/* Content column */}
          <Reveal delay={80}>
            <div className="flex h-full flex-col">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">
                Event details
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-cloud sm:text-4xl">
                {event.title}
              </h1>

              <div className="mt-6 space-y-3 rounded-3xl border border-hairline bg-panel/50 p-5 backdrop-blur-md">
                <MetaRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="When"
                  value={formatEventRange(event)}
                />
                {event.eventDate ? (
                  <MetaRow
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Starts"
                    value={`${formatEventDate(event.eventDate)}${
                      formatEventTime(event.eventDate)
                        ? ` · ${formatEventTime(event.eventDate)}`
                        : ""
                    }`}
                  />
                ) : null}
                {event.location ? (
                  <MetaRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Where"
                    value={event.location}
                  />
                ) : null}
              </div>

              {org?.name ? (
                <div className="mt-4 rounded-3xl border border-hairline bg-white/3 p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
                      <Users className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-faint">
                        Organized by
                      </p>
                      <p className="mt-1 font-medium text-cloud">{org.name}</p>
                      {org.designation ? (
                        <p className="mt-0.5 text-sm text-mist">
                          {org.designation}
                        </p>
                      ) : null}
                      {org.email ? (
                        <a
                          href={`mailto:${org.email}`}
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-violet-bright hover:text-violet"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {org.email}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {(event.tags ?? []).length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {event.tags!.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-hairline-strong bg-white/3 px-3 py-1 text-xs font-medium text-mist"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>

        {/* Description */}
        <Reveal delay={120} className="mt-10">
          <div className="rounded-3xl border border-hairline bg-panel/40 p-6 backdrop-blur-md sm:p-8">
            <h2 className="font-display text-xl font-semibold text-cloud">
              About this event
            </h2>
            <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-mist">
              {event.description ||
                event.shortDescription ||
                "More details will be shared soon."}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet/15 text-violet-bright">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-faint">{label}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-cloud">{value}</p>
      </div>
    </div>
  );
}
