import type { Metadata } from "next";
import { Suspense } from "react";

import getProfile from "@/helpers/next-fetch/getProfile";
import Vendors from "@/features/vendors";
import type { VendorFilterState } from "@/features/vendors/sections/vendor-filters";
import { VendorResults } from "@/features/vendors/sections/vendor-results";
import { VendorCardsSkeleton } from "@/features/vendors/sections/vendor-grid";
import { canAccessVendorDirectory } from "@/lib/forum";
import { expertiseOptions } from "@/lib/validators";
import { VendorLoginGate } from "@/features/vendors/sections/vendor-login-gate";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Verified Experts & Vendor Directory",
  description:
    "Browse Hubology's directory of manually verified business experts. Filter by expertise, hourly rate, and availability — then contact consultants directly.",
  path: "/vendors",
  keywords: [
    "verified business experts",
    "consultant directory",
    "hire business advisor",
    "expert marketplace",
    "freelance business consultants",
    "vendor directory",
    "find a business coach",
    "hourly consulting rates",
  ],
});

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
    availability?: string;
    hourlyRateRange?: string;
    page?: string;
    limit?: string;
    "expertise[]"?: string | string[];
    expertise?: string | string[];
  }>;
}

const ALLOWED_EXPERTISE = new Set<string>(expertiseOptions);

function parseExpertise(raw?: string | string[]): string[] {
  const values = !raw ? [] : Array.isArray(raw) ? raw : [raw];
  return [
    ...new Set(
      values
        .map((item) => item.trim())
        .filter((item) => ALLOWED_EXPERTISE.has(item)),
    ),
  ];
}

function parseFilters(
  sp: Awaited<PageProps["searchParams"]>,
): VendorFilterState & { page: number; limit: number } {
  return {
    search: sp.searchTerm?.trim() ?? "",
    availability: sp.availability?.trim() ?? "",
    hourlyRateRange: sp.hourlyRateRange?.trim() ?? "",
    expertise: parseExpertise(sp["expertise[]"] ?? sp.expertise),
    page: Math.max(1, Number(sp.page) || 1),
    limit: Math.max(1, Number(sp.limit) || 10),
  };
}

export default async function VendorsPage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams);
  const profile = await getProfile();

  if (!profile?._id) {
    return <VendorLoginGate />;
  }

  if (!canAccessVendorDirectory(profile)) {
    return <VendorLoginGate isLoggedIn={true} userRole={profile.role} />;
  }

  return (
    <Vendors
      filters={filters}
      viewer={{
        role: profile.role,
        subscription: profile.subscription ?? null,
        isProfileVisible: profile.vendorProfile?.isProfileVisible === true,
      }}
    >
      <Suspense fallback={<VendorCardsSkeleton />}>
        <VendorResults filters={filters} />
      </Suspense>
    </Vendors>
  );
}
