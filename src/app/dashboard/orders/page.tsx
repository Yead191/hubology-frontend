import type { Metadata } from "next";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import {
  OrdersTable,
  type DashboardOrder,
} from "@/features/dashboard/orders-table";
import { DashboardPager } from "@/features/dashboard/pager";

export const metadata: Metadata = { title: "Orders" };

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function DashboardOrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(1, Number(sp.limit) || 10);

  const res = await nextFetch<DashboardOrder[]>(
    `/order?page=${page}&limit=${limit}`,
    { method: "GET", cache: "no-store" },
  );

  const orders = res.success ? (res.data ?? []) : [];

  return (
    <div>
      <OrdersTable orders={orders} />
      <DashboardPager pagination={res.pagination} basePath="/dashboard/orders" />
    </div>
  );
}
