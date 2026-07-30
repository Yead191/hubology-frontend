import type { Metadata } from "next";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import {
  BookingsTable,
  type DashboardBooking,
} from "@/features/dashboard/bookings-table";
import { DashboardPager } from "@/features/dashboard/pager";

export const metadata: Metadata = { title: "Bookings" };

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function DashboardBookingsPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(1, Number(sp.limit) || 10);

  const res = await nextFetch<DashboardBooking[]>(
    `/bookings?page=${page}&limit=${limit}`,
    { method: "GET", cache: "no-store" },
  );

  const bookings = res.success ? (res.data ?? []) : [];

  return (
    <div>
      <BookingsTable bookings={bookings} />
      <DashboardPager
        pagination={res.pagination}
        basePath="/dashboard/bookings"
      />
    </div>
  );
}
