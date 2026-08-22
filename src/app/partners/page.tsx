import type { Metadata } from "next";
import { Suspense } from "react";

import PartnersExperience from "@/features/partners";
import { PartnerResults } from "@/features/partners/sections/partner-results";
import { PartnerCardsSkeleton } from "@/features/partners/sections/partner-grid";
import type { PartnerListParams } from "@/features/partners/query";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Partners",
  description:
    "Explore Hubology's partner network — trusted organizations offering services and perks to help founders launch and scale.",
  path: "/partners",
  keywords: [
    "Hubology partners",
    "business partner network",
    "founder partner perks",
    "startup ecosystem partners",
  ],
});

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

function parseParams(sp: Awaited<PageProps["searchParams"]>): PartnerListParams {
  return {
    page: Math.max(1, Number(sp.page) || 1),
    limit: Math.max(1, Number(sp.limit) || 10),
  };
}

export default async function PartnersPage({ searchParams }: PageProps) {
  const params = parseParams(await searchParams);

  return (
    <PartnersExperience>
      <Suspense fallback={<PartnerCardsSkeleton />}>
        <PartnerResults params={params} />
      </Suspense>
    </PartnersExperience>
  );
}
