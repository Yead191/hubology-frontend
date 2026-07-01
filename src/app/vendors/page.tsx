import type { Metadata } from "next";

import Vendors from "@/features/vendors";

export const metadata: Metadata = {
  title: "Vendors",
  description:
    "Browse Hubology's directory of manually-verified experts. Search and filter by expertise, rate, and availability, then reach out directly.",
};

export default function VendorsPage() {
  return <Vendors />;
}
