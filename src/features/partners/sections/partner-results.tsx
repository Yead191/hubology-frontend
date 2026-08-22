import type { Partner, Pagination } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { PartnerGrid } from "@/features/partners/sections/partner-grid";
import {
  buildPartnerApiQuery,
  type PartnerListParams,
} from "@/features/partners/query";

export async function PartnerResults({
  params,
}: {
  params: PartnerListParams;
}) {
  const res = await nextFetch<Partner[]>(
    `/partner?${buildPartnerApiQuery(params)}`,
    { method: "GET", cache: "no-store" },
  );

  const partners = res.success ? (res.data ?? []) : [];
  const pagination: Pagination | undefined = res.pagination;

  return (
    <PartnerGrid partners={partners} pagination={pagination} params={params} />
  );
}
