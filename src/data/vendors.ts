/**
 * Legacy mock vendors — the live directory now loads from GET /vendor.
 * Kept only as a reference seed; do not import into pages.
 */
export const vendors = [] as const;

export function getAllVendors() {
  return [];
}

export function getVendorBySlug(_slug: string) {
  return undefined;
}

export function getVendorSlugs(): string[] {
  return [];
}
