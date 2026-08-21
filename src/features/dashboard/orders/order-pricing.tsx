import { TicketPercent } from "lucide-react";

import { formatMoney } from "@/features/dashboard/ui";
import type { DashboardOrder } from "./types";
import {
  discountLabel,
  hasDiscount,
  orderCoupon,
  orderDiscount,
  orderTotal,
} from "./helpers";
import { PriceLine, SectionLabel } from "./ui-bits";

export function OrderPricing({ order }: { order: DashboardOrder }) {
  const breakdown = order.price_breakdown;
  if (!breakdown) return null;

  const paid = orderTotal(order);
  const discounted = hasDiscount(order);
  const coupon = orderCoupon(order);
  const discount = orderDiscount(order);

  return (
    <section>
      <SectionLabel>Payment summary</SectionLabel>
      <div className="mt-3 rounded-2xl border border-hairline bg-white/3 p-4 sm:p-5">
        <PriceLine
          label="Products"
          value={formatMoney(breakdown.products_price)}
        />
        {breakdown.serviceFee != null && breakdown.serviceFee > 0 ? (
          <PriceLine
            label="Service fee"
            value={formatMoney(breakdown.serviceFee)}
          />
        ) : null}
        {breakdown.delivery_charge != null ? (
          <PriceLine
            label="Delivery"
            value={formatMoney(breakdown.delivery_charge)}
          />
        ) : null}
        {breakdown.tax != null && breakdown.tax > 0 ? (
          <PriceLine label="Tax" value={formatMoney(breakdown.tax)} />
        ) : null}

        {coupon ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm text-mist">Coupon</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-violet-bright">
              <TicketPercent className="h-3.5 w-3.5" />
              {coupon}
            </span>
          </div>
        ) : (
          <PriceLine label="Coupon" value="None applied" muted />
        )}

        {discounted && discount > 0 ? (
          <PriceLine
            label="Discount"
            value={`−${discountLabel(order)}`}
            accent
          />
        ) : null}

        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
          <span className="text-sm font-medium text-cloud">Total paid</span>
          <span className="font-display text-xl font-bold tracking-tight text-cloud">
            {formatMoney(paid)}
          </span>
        </div>
      </div>
    </section>
  );
}
