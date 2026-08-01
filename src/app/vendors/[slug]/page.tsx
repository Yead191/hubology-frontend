import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Vendor } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { buildMetadata } from "@/lib/seo";
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
  if (!vendor) {
    return buildMetadata({
      title: "Expert not found",
      description: "This Hubology expert profile could not be found.",
      path: `/vendors/${id}`,
      noIndex: true,
    });
  }

  const jobTitle = vendor.vendorProfile?.jobTitle || "Business Expert";
  const expertise = vendor.vendorProfile?.expertise ?? [];
  const bio =
    vendor.vendorProfile?.bio ||
    `Connect with ${vendor.name}, a verified ${jobTitle} on Hubology.`;

  return buildMetadata({
    title: `${vendor.name} — ${jobTitle}`,
    description: bio.slice(0, 160),
    path: `/vendors/${id}`,
    image: getImageUrl(vendor.image),
    keywords: [
      vendor.name,
      jobTitle,
      vendor.company ?? "",
      "verified Hubology expert",
      "hire business consultant",
      ...expertise.slice(0, 5),
    ],
  });
}

export default async function VendorDetailPage({ params }: PageProps) {
  const { slug: id } = await params;
  const vendor = await getVendor(id);
  if (!vendor) notFound();

  return <VendorDetail vendor={vendor} />;
}
