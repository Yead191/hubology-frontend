import type { EventType, HubEvent } from "@/types";
import { EVENT_TYPE_LABELS } from "@/types";

export function eventTypeLabel(type?: string) {
  if (!type) return "Event";
  return EVENT_TYPE_LABELS[type as EventType] ?? type;
}

export function formatEventDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatEventTime(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function formatEventRange(event: HubEvent) {
  const startDate = formatEventDate(event.eventDate);
  const startTime = formatEventTime(event.eventDate);
  const endTime = formatEventTime(event.endDate);

  if (!event.eventDate) return "Date TBA";

  const sameDay =
    event.endDate &&
    new Date(event.eventDate).toDateString() ===
      new Date(event.endDate).toDateString();

  if (sameDay && startTime && endTime) {
    return `${startDate} · ${startTime} – ${endTime}`;
  }

  if (event.endDate && !sameDay) {
    return `${startDate} → ${formatEventDate(event.endDate)}`;
  }

  return startTime ? `${startDate} · ${startTime}` : startDate;
}

export function isUpcoming(event: HubEvent) {
  if (!event.eventDate) return true;
  return new Date(event.eventDate).getTime() >= Date.now() - 1000 * 60 * 60 * 12;
}
