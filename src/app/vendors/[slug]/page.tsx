import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Vendor } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { VendorDetail } from "@/features/vendors/sections/vendor-detail";

interface PageProps {
  /** Route param is named `slug` but carries the vendor `_id`. */
  params: Promise<{ slug: string }>;
}

async function getVendor(id: string) {
  const res = await nextFetch<Vendor>(`/vendor/${id}`, {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["vendors", `vendor-${id}`], revalidate: 60 * 60 },
  });
  return res.success ? res.data : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: id } = await params;
  const vendor = await getVendor(id);
  if (!vendor) return { title: "Vendor not found" };
  const jobTitle = vendor.vendorProfile?.jobTitle || "Expert";
  return {
    title: `${vendor.name} — ${jobTitle}`,
    description: vendor.vendorProfile?.bio,
  };
}

export default async function VendorDetailPage({ params }: PageProps) {
  const { slug: id } = await params;
  const vendor = await getVendor(id);
  if (!vendor) notFound();

  return <VendorDetail vendor={vendor} />;
}
