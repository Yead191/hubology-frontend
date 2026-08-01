import type { Metadata } from "next";

import { PaymentResult } from "@/features/service-booking/sections/payment-result";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Payment successful",
  "Your Hubology payment is confirmed.",
);

interface PageProps {
  searchParams: Promise<{
    session_id?: string;
    type?: string;
  }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { session_id, type } = await searchParams;
  return (
    <PaymentResult status="success" sessionId={session_id} type={type} />
  );
}
