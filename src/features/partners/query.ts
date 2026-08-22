export type PartnerListParams = {
  page: number;
  limit: number;
};

export function buildPartnersHref(page: number, limit: number) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (limit !== 10) params.set("limit", String(limit));
  const qs = params.toString();
  return qs ? `/partners?${qs}` : "/partners";
}

export function buildPartnerApiQuery(params: PartnerListParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  return search.toString();
}

export function partnerHref(id: string) {
  return `/partners/${id}`;
}

export const PARTNER_APPLY_PATH = "/partners/apply";
