import type { Metadata } from "next";

import CheckoutExperience from "@/features/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order securely.",
};

export default function CheckoutPage() {
  return <CheckoutExperience />;
}
