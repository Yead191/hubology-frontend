import type { Metadata } from "next";

import { PaymentResult } from "@/features/service-booking/sections/payment-result";
import { revalidateTags } from "@/helpers/next-fetch/revalidateTags";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Your Hubology payment is confirmed.",
};

interface PageProps {
  searchParams: Promise<{
    session_id?: string;
    type?: string;
  }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { session_id, type } = await searchParams;

  // Membership subscription lands on the profile — refresh cached profile.
  const t = (type ?? "").toLowerCase();
  if (t.includes("membership") || t.includes("subscription")) {
    await revalidateTags(["user-profile"]);
  }
  if (t.includes("checkout") || t.includes("order")) {
    await revalidateTags(["cart"]);
  }

  return (
    <PaymentResult status="success" sessionId={session_id} type={type} />
  );
}
