import type { Metadata } from "next";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import {
  DigitalTable,
  type DashboardDigitalItem,
} from "@/features/dashboard/digital-table";
import { DashboardPager } from "@/features/dashboard/pager";

export const metadata: Metadata = { title: "Digital library" };

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function DashboardDigitalPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(1, Number(sp.limit) || 10);

  const res = await nextFetch<DashboardDigitalItem[]>(
    `/digital?page=${page}&limit=${limit}`,
    { method: "GET", cache: "no-store" },
  );

  const items = res.success ? (res.data ?? []) : [];

  return (
    <div>
      <DigitalTable items={items} />
      <DashboardPager
        pagination={res.pagination}
        basePath="/dashboard/digital"
      />
    </div>
  );
}
