import type { Metadata } from "next";

import OfficeSuppliesExperience from "@/features/office-supplies";

export const metadata: Metadata = {
  title: "Office Supplies",
  description:
    "Premium physical goods designed to keep founders organized and focused on what matters most.",
};

export default function OfficeSuppliesPage() {
  return <OfficeSuppliesExperience />;
}
