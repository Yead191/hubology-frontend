import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Partner } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { PartnerDetail } from "@/features/partners/sections/partner-detail";
import { buildMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/getImageUrl";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchPartner(id: string): Promise<Partner | null> {
  const res = await nextFetch<Partner>(`/partner/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  if (res.success && res.data?._id) return res.data;

  if (res.success && Array.isArray(res.data) && res.data[0]?._id) {
    return res.data[0] as Partner;
  }

  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const partner = await fetchPartner(id);
  if (!partner) {
    return buildMetadata({
      title: "Partner not found",
      description: "This Hubology partner could not be found.",
      path: `/partners/${id}`,
    });
  }

  return buildMetadata({
    title: partner.name,
    description:
      partner.description?.slice(0, 160) ||
      `Learn more about ${partner.name}, a Hubology partner.`,
    path: `/partners/${partner._id}`,
    image: getImageUrl(partner.image),
    keywords: [
      partner.name,
      ...(partner.offers ?? []),
      "Hubology partner",
    ],
  });
}

export default async function PartnerDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  const partner = await fetchPartner(id);
  if (!partner) notFound();

  return <PartnerDetail partner={partner} />;
}
