import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Hubology",
  description:
    "Contact Hubology for partnership inquiries, expert support, membership questions, or help growing your business. We respond to founders and vendors promptly.",
  path: "/contact",
  keywords: [
    "contact Hubology",
    "business support contact",
    "founder help desk",
    "partnership inquiry",
    "talk to Hubology team",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
