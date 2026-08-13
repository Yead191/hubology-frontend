import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Crown,
  Package,
  User,
} from "lucide-react";

import type { UserSubscription } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import { Button } from "@/components/ui/button";
import { DashboardPanel } from "@/features/dashboard/ui";
import { DashboardMembershipCard } from "@/features/dashboard/membership-card";

async function countTotal(url: string) {
  const res = await nextFetch(url, {
    method: "GET",
    cache: "no-store",
  });
  return res.success
    ? (res.pagination?.total ??
        (Array.isArray(res.data) ? res.data.length : 0))
    : 0;
}

export default async function DashboardOverviewPage() {
  const user = await getProfile();
  const [bookings, digital, orders, subscriptionsRes] = await Promise.all([
    countTotal("/bookings?page=1&limit=1"),
    countTotal("/digital?page=1&limit=1"),
    countTotal("/order?page=1&limit=1"),
    nextFetch<UserSubscription[]>("/subscription", {
      method: "GET",
      cache: "no-store",
    }),
  ]);

  const subscriptions = subscriptionsRes.success
    ? (subscriptionsRes.data ?? [])
    : [];
  const activeSub =
    subscriptions.find((s) => {
      const status = (s.status ?? "")
        .toLowerCase()
        .trim()
        .replace(/[_\s]+/g, "-");
      return status === "active" || status === "cancel-pending";
    }) ?? null;

  const cards = [
    {
      label: "Bookings",
      value: bookings,
      href: "/dashboard/bookings",
      icon: CalendarCheck,
    },
    {
      label: "Digital products",
      value: digital,
      href: "/dashboard/digital",
      icon: BookOpen,
    },
    {
      label: "Orders",
      value: orders,
      href: "/dashboard/orders",
      icon: Package,
    },
    {
      label: "Subscriptions",
      value: subscriptions.length,
      href: "/dashboard/subscriptions",
      icon: Crown,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DashboardPanel
        title="Account overview"
        description="A quick look at your Hubology activity."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/profile">
              <User className="h-4 w-4" /> Edit profile
            </Link>
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-hairline bg-white/3 p-4 transition-colors hover:border-violet/40 hover:bg-violet/8"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet/15 text-violet-bright">
                  <Icon className="h-4 w-4" />
                </span>
                <ArrowRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-cloud" />
              </div>
              <p className="mt-4 font-display text-2xl font-bold text-cloud tabular-nums">
                {value}
              </p>
              <p className="mt-1 text-sm text-mist">{label}</p>
            </Link>
          ))}
        </div>
      </DashboardPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardPanel title="Profile" description="Signed-in account details.">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-hairline pb-3">
              <dt className="text-mist">Name</dt>
              <dd className="font-medium text-cloud">{user?.name || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-hairline pb-3">
              <dt className="text-mist">Email</dt>
              <dd className="font-medium text-cloud">{user?.email || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-hairline pb-3">
              <dt className="text-mist">Role</dt>
              <dd className="font-medium text-cloud">{user?.role || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mist">Company</dt>
              <dd className="font-medium text-cloud">
                {user?.company || "—"}
              </dd>
            </div>
          </dl>
        </DashboardPanel>

        <DashboardMembershipCard subscription={activeSub} />
      </div>
    </div>
  );
}
