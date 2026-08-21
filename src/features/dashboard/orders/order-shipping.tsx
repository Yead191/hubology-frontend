import { MapPin, Phone } from "lucide-react";

import type { DashboardOrder } from "./types";
import { SectionLabel } from "./ui-bits";

export function OrderShipping({ order }: { order: DashboardOrder }) {
  const phone =
    order.contact_number || order.address_breakdown?.contact_number || "";
  const addr = order.address_breakdown;

  return (
    <section>
      <SectionLabel>Shipping</SectionLabel>
      <div className="mt-3 rounded-2xl border border-hairline bg-white/3 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-sm leading-relaxed text-cloud">
              {order.formatted_address ||
                [
                  addr?.street_address,
                  addr?.city,
                  addr?.postal_code,
                  addr?.country,
                ]
                  .filter(Boolean)
                  .join(", ") ||
                "—"}
            </p>
            {addr?.street_address && order.formatted_address ? (
              <p className="text-xs text-faint">
                {[addr.city, addr.postal_code, addr.country]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
          </div>
        </div>

        {phone ? (
          <div className="mt-3 flex items-center gap-2.5 border-t border-hairline pt-3 text-sm text-mist">
            <Phone className="h-3.5 w-3.5 text-faint" />
            <span className="text-cloud">{phone}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
