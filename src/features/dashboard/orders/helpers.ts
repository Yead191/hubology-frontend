import { formatMoney } from "@/features/dashboard/ui";
import type { DashboardOrder } from "./types";

export function orderCoupon(o: DashboardOrder) {
  return o.coupon?.trim() || o.address_breakdown?.coupon?.trim() || "";
}

export function orderDiscount(o: DashboardOrder) {
  return o.discount_amount ?? o.price_breakdown?.discount_amount ?? 0;
}

export function hasDiscount(o: DashboardOrder) {
  if (orderCoupon(o)) return true;
  return orderDiscount(o) > 0;
}

export function discountLabel(o: DashboardOrder) {
  const parts: string[] = [];
  if ((o.discount_percentage ?? 0) > 0) {
    parts.push(`${o.discount_percentage}%`);
  }
  const amount = orderDiscount(o);
  if (amount > 0) parts.push(formatMoney(amount));
  return parts.length > 0 ? parts.join(" · ") : "Applied";
}

export function orderTotal(o: DashboardOrder) {
  return o.price_breakdown?.total_price ?? o.price_breakdown?.subtotal;
}

export function isRefundRequested(o: DashboardOrder) {
  const status = (o.status ?? "").toLowerCase();
  return status.includes("refund request");
}

export function isRefunded(o: DashboardOrder) {
  const status = (o.status ?? "").toLowerCase();
  const payment = (o.payment_status ?? "").toLowerCase();
  return (
    Boolean(o.refund) ||
    status === "refunded" ||
    payment === "refunded"
  );
}

/** True when the user can still submit a refund request. */
export function canRequestRefund(o: DashboardOrder) {
  if (isRefunded(o) || isRefundRequested(o)) return false;
  return true;
}
