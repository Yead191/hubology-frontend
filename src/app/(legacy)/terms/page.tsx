import type { Metadata } from "next";

import { LegalLayout } from "@/components/layout/legal-layout";
import { getDisclaimer } from "@/helpers/next-fetch/getDisclaimer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms and Conditions",
  description:
    "Read the Hubology terms and conditions covering account use, services, memberships, and platform guidelines.",
  path: "/terms",
  keywords: [
    "Hubology terms of service",
    "terms and conditions",
    "platform rules",
  ],
});

export default async function TermsPage() {
  const html = await getDisclaimer("user-terms");

  return <LegalLayout title="Terms and Conditions" html={html} />;
}
