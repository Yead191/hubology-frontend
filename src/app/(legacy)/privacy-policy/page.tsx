import type { Metadata } from "next";

import { LegalLayout } from "@/components/layout/legal-layout";
import { getDisclaimer } from "@/helpers/next-fetch/getDisclaimer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read the Hubology privacy policy to learn how we collect, use, store, and protect your personal data.",
  path: "/privacy-policy",
  keywords: ["Hubology privacy policy", "data protection", "personal data policy"],
});

export default async function PrivacyPolicyPage() {
  const html = await getDisclaimer("privacy");

  return <LegalLayout title="Privacy Policy" html={html} />;
}
