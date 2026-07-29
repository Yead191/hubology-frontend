import type { Metadata } from "next";

import { PaymentResult } from "@/features/service-booking/sections/payment-result";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Your Hubology booking is confirmed.",
};

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;
  return <PaymentResult status="success" sessionId={session_id} />;
}
