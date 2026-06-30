import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { ComingSoon } from "@/components/sections/coming-soon";

export const metadata: Metadata = {
  title: "Store",
  description: "Curated tools, templates, and resources for founders — coming soon.",
};

export default function StorePage() {
  return (
    <ComingSoon
      icon={ShoppingBag}
      eyebrow="Store · Coming soon"
      title="A marketplace built for founders"
      description="Templates, playbooks, and vetted tools — handpicked by the experts you already trust on Hubology."
      bullets={[
        "Done-for-you legal and financial templates",
        "Growth playbooks from operators who have scaled",
        "Exclusive member pricing on partner tools",
      ]}
    />
  );
}
