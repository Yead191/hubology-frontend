"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { revalidateAfterPayment } from "@/helpers/next-fetch/paymentRevalidate";

/**
 * Runs payment cache revalidation outside of RSC render, then refreshes
 * so navbar / membership / cart pick up fresh data.
 *
 * Membership payments often land before the Stripe webhook finishes —
 * a follow-up refresh covers that race.
 */
export function PaymentCacheRefresh({
  tags,
  /** Extra delayed refresh (ms). Useful when the backend updates async (webhooks). */
  retryMs = 0,
}: {
  tags: string[];
  retryMs?: number;
}) {
  const router = useRouter();
  const key = tags.join(",");
  const ran = React.useRef(false);

  React.useEffect(() => {
    if (ran.current || !key) return;
    ran.current = true;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    void (async () => {
      await revalidateAfterPayment(tags);
      if (cancelled) return;
      router.refresh();

      if (retryMs > 0) {
        retryTimer = setTimeout(() => {
          void (async () => {
            await revalidateAfterPayment(tags);
            if (!cancelled) router.refresh();
          })();
        }, retryMs);
      }
    })();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
    // Intentionally keyed by `key` so a stable tag set only runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, retryMs, router]);

  return null;
}
