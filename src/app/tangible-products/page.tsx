import type { Metadata } from "next";

import TangibleProductsExperience from "@/features/tangible-products";

export const metadata: Metadata = {
  title: "Tangible Products",
  description:
    "Premium physical goods designed to keep founders organized and focused on what matters most.",
};

export default function TangibleProductsPage() {
  return <TangibleProductsExperience />;
}
