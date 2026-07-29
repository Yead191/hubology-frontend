import type { Book } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";

/** Canonical id for links / purchase tracking. */
export function bookId(book: Book) {
  return book._id;
}

export function bookHref(book: Book) {
  return `/store/${book._id}`;
}

/** Office supply product detail URL (same book `_id` as the API). */
export function officeProductHref(book: Book) {
  return `/office-supplies/${book._id}`;
}

export function bookCoverUrl(book: Book) {
  return getImageUrl(book.image) ?? undefined;
}

export function bookFileUrl(book: Book) {
  return getImageUrl(book.file) ?? undefined;
}

export function bookAccent(book: Book): [string, string] {
  const [from, to] = book.accent ?? [];
  return [from || "#8131f0", to || "#4a1c8a"];
}
