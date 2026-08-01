import type { Metadata } from "next";

import { PaymentResult } from "@/features/service-booking/sections/payment-result";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Payment not completed",
  "Your payment was cancelled or could not be processed.",
);

interface PageProps {
  searchParams: Promise<{
    session_id?: string;
    type?: string;
  }>;
}

export default async function PaymentFailedPage({ searchParams }: PageProps) {
  const { session_id, type } = await searchParams;
  return (
    <PaymentResult status="failed" sessionId={session_id} type={type} />
  );
}
