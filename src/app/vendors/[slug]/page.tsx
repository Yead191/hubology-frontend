import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getVendorBySlug, getVendorSlugs } from "@/data/vendors";
import { VendorDetail } from "@/features/vendors/sections/vendor-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getVendorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  if (!vendor) return { title: "Vendor not found" };
  return {
    title: `${vendor.name} — ${vendor.role}`,
    description: vendor.bio,
  };
}

export default async function VendorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  if (!vendor) notFound();

  return <VendorDetail vendor={vendor} />;
}
