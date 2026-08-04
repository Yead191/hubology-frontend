import type { Metadata } from "next";

import { LegalLayout } from "@/components/layout/legal-layout";
import { getDisclaimer } from "@/helpers/next-fetch/getDisclaimer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Refund Policy",
  description:
    "Understand Hubology refund and return guidelines for services, digital products, memberships, and office supplies.",
  path: "/refund",
  keywords: ["Hubology refund policy", "return policy", "cancellation refunds"],
});

export default async function RefundPolicyPage() {
  const html = await getDisclaimer("refund");

  return <LegalLayout title="Refund Policy" html={html} />;
}
