import type { Metadata } from "next";

import { PaymentResult } from "@/features/service-booking/sections/payment-result";
import { PaymentCacheRefresh } from "@/features/service-booking/sections/payment-cache-refresh";

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

  const t = (type ?? "").toLowerCase();
  const tags: string[] = [];
  if (t.includes("membership") || t.includes("subscription")) {
    tags.push("user-profile");
  }
  if (t.includes("checkout") || t.includes("order")) {
    tags.push("cart");
  }

  return (
    <>
      <PaymentCacheRefresh
        tags={tags}
        // Stripe webhooks can lag a few seconds after redirect.
        retryMs={
          t.includes("membership") || t.includes("subscription") ? 2500 : 0
        }
      />
      <PaymentResult status="success" sessionId={session_id} type={type} />
    </>
  );
}
