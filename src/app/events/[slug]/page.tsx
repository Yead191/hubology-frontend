import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { HubEvent } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { EventDetail } from "@/features/events/sections/event-detail";
import { buildMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/getImageUrl";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchEvent(slug: string): Promise<HubEvent | null> {
  const res = await nextFetch<HubEvent>(`/event/${slug}`, {
    method: "GET",
    cache: "no-store",
  });
  if (res.success && res.data?.slug) return res.data;

  // Some APIs wrap a single item; tolerate array payloads.
  if (res.success && Array.isArray(res.data) && res.data[0]?.slug) {
    return res.data[0] as HubEvent;
  }

  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEvent(slug);
  if (!event) {
    return buildMetadata({
      title: "Event not found",
      description: "This Hubology event could not be found.",
      path: `/events/${slug}`,
    });
  }

  const description =
    event.shortDescription ||
    event.description?.slice(0, 160) ||
    `Join ${event.title} on Hubology.`;

  return buildMetadata({
    title: event.title,
    description,
    path: `/events/${event.slug}`,
    image: getImageUrl(event.coverImage),
    keywords: [
      event.title,
      ...(event.tags ?? []),
      "Hubology event",
      String(event.type ?? "event"),
    ],
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const event = await fetchEvent(slug);
  if (!event) notFound();

  return <EventDetail event={event} />;
}
