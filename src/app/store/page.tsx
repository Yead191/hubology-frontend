import type { Metadata } from "next";

import StoreExperience from "@/features/store";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Step into the Hubology 3D bookstore — a shelf of founder-built books. Browse in 3D, then buy and download.",
};

export default function StorePage() {
  return <StoreExperience />;
}
