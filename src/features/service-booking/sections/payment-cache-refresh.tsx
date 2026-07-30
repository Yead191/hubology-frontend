"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { revalidateTags } from "@/helpers/next-fetch/revalidateTags";

/**
 * Runs cache revalidation outside of RSC render (required by Next.js),
 * then refreshes so the navbar cart / profile pick up fresh data.
 */
export function PaymentCacheRefresh({ tags }: { tags: string[] }) {
  const router = useRouter();
  const key = tags.join(",");
  const ran = React.useRef(false);

  React.useEffect(() => {
    if (ran.current || !key) return;
    ran.current = true;

    void (async () => {
      await revalidateTags(tags);
      router.refresh();
    })();
  }, [key, tags, router]);

  return null;
}
