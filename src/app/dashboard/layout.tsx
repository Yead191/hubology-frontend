import type { Metadata } from "next";
import { redirect } from "next/navigation";

import getProfile from "@/helpers/next-fetch/getProfile";
import { DashboardShell } from "@/features/dashboard/shell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Dashboard",
  "Manage your Hubology account, bookings, and purchases.",
);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/dashboard")}`);
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
