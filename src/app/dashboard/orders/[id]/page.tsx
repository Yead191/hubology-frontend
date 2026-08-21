import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { OrderDetail, type DashboardOrder } from "@/features/dashboard/orders";

export const metadata: Metadata = { title: "Order details" };

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchOrder(id: string): Promise<DashboardOrder | null> {
  // Prefer single-order endpoint; fall back to list match if unavailable.
  const byId = await nextFetch<DashboardOrder>(`/order/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  if (byId.success && byId.data?._id) return byId.data;

  const list = await nextFetch<DashboardOrder[]>(`/order?page=1&limit=100`, {
    method: "GET",
    cache: "no-store",
  });
  if (!list.success || !list.data) return null;

  return (
    list.data.find((o) => o._id === id || o.order_id === id) ?? null
  );
}

export default async function DashboardOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  const order = await fetchOrder(id);
  if (!order) notFound();

  return <OrderDetail order={order} />;
}
