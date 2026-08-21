import Image from "next/image";

import { getImageUrl } from "@/lib/getImageUrl";
import { formatMoney } from "@/features/dashboard/ui";
import type { DashboardOrderItem } from "./types";
import { SectionLabel } from "./ui-bits";

export function OrderItems({ items }: { items?: DashboardOrderItem[] }) {
  const list = items ?? [];

  return (
    <section>
      <SectionLabel>Items</SectionLabel>
      {list.length === 0 ? (
        <p className="mt-3 text-sm text-mist">No items on this order.</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {list.map((item, i) => {
            const image = getImageUrl(item.image);
            return (
              <li
                key={`${item.title}-${i}`}
                className="flex gap-3.5 rounded-2xl border border-hairline bg-white/3 p-3.5 transition-colors hover:bg-white/4"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-hairline bg-ink">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.title || "Item"}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-cloud">
                    {item.title || "Item"}
                  </p>
                  <p className="mt-1 text-xs text-mist">
                    Qty {item.quantity ?? 0} · {formatMoney(item.unit_price)} each
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-cloud">
                  {formatMoney(item.total_price)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
