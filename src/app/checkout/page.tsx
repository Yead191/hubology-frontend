import type { Metadata } from "next";
import { redirect } from "next/navigation";

import type { CartData } from "@/types";
import getProfile from "@/helpers/next-fetch/getProfile";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import CheckoutExperience from "@/features/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order securely.",
};

export default async function CheckoutPage() {
  const user = await getProfile();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/checkout")}`);
  }

  const res = await nextFetch<CartData>("/cart", {
    method: "GET",
    cache: "no-store",
    tags: ["cart"],
  });
  const cart = res.success && res.data ? res.data : null;

  return (
    <CheckoutExperience
      cart={cart}
      user={{
        name: user.name ?? "",
        email: user.email ?? "",
      }}
    />
  );
}
