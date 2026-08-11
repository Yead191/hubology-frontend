"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, MapPin, TicketPercent } from "lucide-react";

import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  DashboardPanel,
  DashboardTable,
  EmptyDash,
  StatusPill,
  formatDate,
  formatMoney,
  statusTone,
} from "@/features/dashboard/ui";

export interface DashboardOrder {
  _id: string;
  order_id?: string;
  status?: string;
  payment_status?: string;
  total_items?: number;
  formatted_address?: string;
  contact_number?: string;
  createdAt?: string;
  payment_intent_id?: string;
  transaction_id?: string;
  coupon?: string;
  discount_percentage?: number;
  discount_amount?: number;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string | null;
  };
  items?: Array<{
    title?: string;
    image?: string | null;
    quantity?: number;
    unit_price?: number;
    total_price?: number;
  }>;
  price_breakdown?: {
    products_price?: number;
    serviceFee?: number;
    delivery_charge?: number;
    discount_amount?: number;
    tax?: number;
    total_price?: number;
    subtotal?: number;
  };
  address_breakdown?: {
    city?: string;
    postal_code?: string;
    street_address?: string;
    country?: string;
    contact_number?: string;
    coupon?: string;
  };
}

function orderCoupon(o: DashboardOrder) {
  return (
    o.coupon?.trim() ||
    o.address_breakdown?.coupon?.trim() ||
    ""
  );
}

function orderDiscount(o: DashboardOrder) {
  return (
    o.discount_amount ??
    o.price_breakdown?.discount_amount ??
    0
  );
}

function hasDiscount(o: DashboardOrder) {
  if (orderCoupon(o)) return true;
  return orderDiscount(o) > 0;
}

function discountLabel(o: DashboardOrder) {
  const parts: string[] = [];
  if ((o.discount_percentage ?? 0) > 0) {
    parts.push(`${o.discount_percentage}%`);
  }
  const amount = orderDiscount(o);
  if (amount > 0) parts.push(formatMoney(amount));
  return parts.length > 0 ? parts.join(" · ") : "Applied";
}

export function OrdersTable({ orders }: { orders: DashboardOrder[] }) {
  const [selected, setSelected] = React.useState<DashboardOrder | null>(null);

  return (
    <>
      <DashboardPanel
        title="Order history"
        description="Office supply orders and shipment details."
      >
        {orders.length === 0 ? (
          <>
            <EmptyDash
              title="No orders yet"
              message="When you check out office supplies, your orders will show up here."
            />
            <div className="mt-4 flex justify-center">
              <Button asChild size="sm">
                <Link href="/office-supplies">Browse supplies</Link>
              </Button>
            </div>
          </>
        ) : (
          <DashboardTable
            headers={[
              "Order",
              "Date",
              "Items",
              "Total",
              "Coupon",
              "Status",
              "Payment",
              "",
            ]}
          >
            {orders.map((o) => {
              const total =
                o.price_breakdown?.total_price ?? o.price_breakdown?.subtotal;
              const subtotal = o.price_breakdown?.subtotal;
              const discounted = hasDiscount(o);
              const coupon = orderCoupon(o);

              return (
                <tr key={o._id} className="hover:bg-white/2">
                  <td className="px-4 py-3 font-medium text-cloud">
                    {o.order_id || o._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3 text-mist">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-mist">
                    {o.total_items ?? o.items?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-cloud">
                        {formatMoney(total)}
                      </span>
                      {discounted &&
                      subtotal != null &&
                      total != null &&
                      subtotal > total ? (
                        <span className="text-xs text-faint line-through">
                          {formatMoney(subtotal)}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {coupon ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/25 bg-violet/10 px-2.5 py-0.5 text-xs font-medium text-violet-bright">
                        <TicketPercent className="h-3 w-3" />
                        {coupon}
                      </span>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      value={o.status || "—"}
                      tone={statusTone(o.status)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      value={o.payment_status || "—"}
                      tone={statusTone(o.payment_status)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelected(o)}
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </DashboardTable>
        )}
      </DashboardPanel>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Order ${selected.order_id || ""}` : "Order"}
        description="Items, shipping, coupon, and payment breakdown."
        className="max-w-md"
      >
        {selected ? <OrderDetailModal order={selected} /> : null}
      </Modal>
    </>
  );
}

function OrderDetailModal({ order }: { order: DashboardOrder }) {
  const breakdown = order.price_breakdown;
  const paid = breakdown?.total_price ?? breakdown?.subtotal;
  const discounted = hasDiscount(order);
  const coupon = orderCoupon(order);
  const discount = orderDiscount(order);

  return (
    <div className="space-y-5">
      {/* Total + status */}
      <div className="relative overflow-hidden rounded-2xl border border-hairline-strong bg-white/[0.04] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-violet/25 blur-3xl"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              Order total
            </p>
            <p className="mt-1 font-display text-3xl font-bold tracking-tight text-cloud">
              {formatMoney(paid)}
            </p>
            {discounted && discount > 0 ? (
              <p className="mt-1 text-sm text-mist">
                {breakdown?.subtotal != null &&
                paid != null &&
                breakdown.subtotal > paid ? (
                  <>
                    <span className="line-through text-faint">
                      {formatMoney(breakdown.subtotal)}
                    </span>
                    <span className="mx-1.5 text-faint">·</span>
                  </>
                ) : null}
                Saved {formatMoney(discount)}
                {(order.discount_percentage ?? 0) > 0
                  ? ` (${order.discount_percentage}%)`
                  : ""}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusPill
              value={order.status || "—"}
              tone={statusTone(order.status)}
            />
            <StatusPill
              value={order.payment_status || "—"}
              tone={statusTone(order.payment_status)}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <section>
        <SectionLabel>Items</SectionLabel>
        <ul className="mt-2 space-y-2">
          {(order.items ?? []).map((item, i) => {
            const image = getImageUrl(item.image);
            return (
              <li
                key={`${item.title}-${i}`}
                className="flex gap-3 rounded-2xl border border-hairline bg-white/[0.03] p-3"
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-hairline bg-ink">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.title || "Item"}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-cloud">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-mist">
                    × {item.quantity} · {formatMoney(item.unit_price)} each
                  </p>
                </div>
                <p className="text-sm font-medium text-cloud">
                  {formatMoney(item.total_price)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Shipping */}
      <section>
        <SectionLabel>Shipping</SectionLabel>
        <div className="mt-2 flex items-start gap-3 rounded-2xl border border-hairline bg-white/[0.03] px-3.5 py-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm leading-relaxed text-cloud">
              {order.formatted_address || "—"}
            </p>
            <p className="mt-1 text-xs text-mist">
              {order.contact_number ||
                order.address_breakdown?.contact_number ||
                "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      {breakdown ? (
        <section>
          <SectionLabel>Pricing</SectionLabel>
          <div className="mt-2 rounded-2xl border border-hairline bg-white/[0.03] p-4">
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

            <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
              <span className="text-sm font-medium text-cloud">Total paid</span>
              <span className="font-display text-lg font-bold text-cloud">
                {formatMoney(paid)}
              </span>
            </div>
          </div>
        </section>
      ) : null}

      <div className="space-y-1.5 border-t border-hairline pt-4 text-xs text-faint">
        <p>
          Placed on{" "}
          <span className="text-mist">{formatDate(order.createdAt)}</span>
        </p>
        {(order.payment_intent_id || order.transaction_id) && (
          <p
            className="truncate"
            title={order.payment_intent_id || order.transaction_id}
          >
            Payment ID{" "}
            <span className="font-mono text-mist/90">
              {order.payment_intent_id || order.transaction_id}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
      {children}
    </h3>
  );
}

function PriceLine({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="mt-2.5 flex items-center justify-between gap-3 first:mt-0">
      <span className="text-sm text-mist">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          muted && "text-faint",
          accent && "text-emerald-300",
          !muted && !accent && "text-cloud",
        )}
      >
        {value}
      </span>
    </div>
  );
}
