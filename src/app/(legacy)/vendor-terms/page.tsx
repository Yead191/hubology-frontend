import type { Metadata } from "next";

import { LegalLayout } from "@/components/layout/legal-layout";
import { getDisclaimer } from "@/helpers/next-fetch/getDisclaimer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Vendor Terms & Conditions",
  description:
    "Expert and vendor terms for Hubology — vetting, onboarding, listings, consultations, and professional conduct on the platform.",
  path: "/vendor-terms",
  keywords: [
    "Hubology vendor terms",
    "expert terms and conditions",
    "consultant platform rules",
  ],
});

export default async function VendorTermsPage() {
  const html = await getDisclaimer("vendor-terms");

  return (
    <LegalLayout title="Vendor Terms & Conditions Policy" html={html} />
  );
}