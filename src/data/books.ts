/**
 * Legacy mock books — the live store now loads from GET /books.
 * Kept only as a reference seed; do not import into pages.
 */
export const books = [] as const;

export function getAllBooks() {
  return [];
}

export function getBookBySlug(_slug: string) {
  return undefined;
}

export function getBookSlugs(): string[] {
  return [];
}
