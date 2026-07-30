import type { Metadata } from "next";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import {
  SubscriptionsTable,
  type DashboardSubscription,
} from "@/features/dashboard/subscriptions-table";

export const metadata: Metadata = { title: "Subscriptions" };

export default async function DashboardSubscriptionsPage() {
  const res = await nextFetch<DashboardSubscription[]>("/subscription", {
    method: "GET",
    cache: "no-store",
  });

  const subscriptions = res.success ? (res.data ?? []) : [];

  return <SubscriptionsTable subscriptions={subscriptions} />;
}
