"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MapPin, TicketPercent } from "lucide-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  DashboardPanel,
  DashboardTable,
  EmptyDash,
  StatusPill,
  formatDate,
  formatMoney,
  statusTone,
} from "@/features/dashboard/ui";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";

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
  refund?: {
    _id?: string;
    refundType?: string;
    status?: string;
    refundAmount?: number;
    adminNote?: string;
    stripeRefundId?: string;
  };
}

function orderCoupon(o: DashboardOrder) {
  return o.coupon?.trim() || o.address_breakdown?.coupon?.trim() || "";
}

function orderDiscount(o: DashboardOrder) {
  return o.discount_amount ?? o.price_breakdown?.discount_amount ?? 0;
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
              // "Coupon",
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
                  {/* <td className="px-4 py-3">
                    {coupon ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/25 bg-violet/10 px-2.5 py-0.5 text-xs font-medium text-violet-bright">
                        <TicketPercent className="h-3 w-3" />
                        {coupon}
                      </span>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td> */}
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
  const router = useRouter();
  const [orderState, setOrderState] = React.useState(order);

  // Refund request UI state (only visible when no `order.refund` exists yet).
  const [refundFormOpen, setRefundFormOpen] = React.useState(false);
  const [policyConfirmed, setPolicyConfirmed] = React.useState(false);
  const [refundReason, setRefundReason] = React.useState("");
  const [refundFiles, setRefundFiles] = React.useState<File[]>([]);
  const [refundSubmitting, setRefundSubmitting] = React.useState(false);
  const [refundRequestSent, setRefundRequestSent] = React.useState(false);
  const [refundConfirmationOpen, setRefundConfirmationOpen] =
    React.useState(false);

  React.useEffect(() => {
    setOrderState(order);
    setRefundFormOpen(false);
    setPolicyConfirmed(false);
    setRefundReason("");
    setRefundFiles([]);
    setRefundSubmitting(false);
    setRefundRequestSent(false);
    setRefundConfirmationOpen(false);
  }, [order]);

  const breakdown = orderState.price_breakdown;
  const paid = breakdown?.total_price ?? breakdown?.subtotal;
  const discounted = hasDiscount(orderState);
  const coupon = orderCoupon(orderState);
  const discount = orderDiscount(orderState);
  const orderIdForRefund = orderState._id;

  return (
    <>
      <div className="space-y-5">
      {/* Total + status */}
      <div className="relative overflow-hidden rounded-2xl border border-hairline-strong bg-white/4 p-5">
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
                {(orderState.discount_percentage ?? 0) > 0
                  ? ` (${orderState.discount_percentage}%)`
                  : ""}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusPill
              value={orderState.status || "—"}
              tone={statusTone(orderState.status)}
            />
            <StatusPill
              value={orderState.payment_status || "—"}
              tone={statusTone(orderState.payment_status)}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <section>
        <SectionLabel>Items</SectionLabel>
        <ul className="mt-2 space-y-2">
          {(orderState.items ?? []).map((item, i) => {
            const image = getImageUrl(item.image);
            return (
              <li
                key={`${item.title}-${i}`}
                className="flex gap-3 rounded-2xl border border-hairline bg-white/3 p-3"
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
        <div className="mt-2 flex items-start gap-3 rounded-2xl border border-hairline bg-white/3 px-3.5 py-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm leading-relaxed text-cloud">
              {orderState.formatted_address || "—"}
            </p>
            <p className="mt-1 text-xs text-mist">
              {orderState.contact_number ||
                orderState.address_breakdown?.contact_number ||
                "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      {breakdown ? (
        <section>
          <SectionLabel>Pricing</SectionLabel>
          <div className="mt-2 rounded-2xl border border-hairline bg-white/3 p-4">
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
                value={`−${discountLabel(orderState)}`}
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

      {/* Refund */}
      {orderState.refund ? (
        <section>
          <SectionLabel>Refund</SectionLabel>
          <div className="mt-2 rounded-2xl border border-hairline bg-white/3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <StatusPill
                  value={orderState.refund.status || "—"}
                  tone={statusTone(orderState.refund.status)}
                />
                <p className="text-xs text-mist">
                  Type:{" "}
                  <span className="font-medium text-cloud">
                    {orderState.refund.refundType || "—"}
                  </span>
                </p>
              </div>

              {orderState.refund.refundAmount != null ? (
                <div className="text-right">
                  <p className="text-xs text-faint">Refund amount</p>
                  <p className="mt-1 text-sm font-semibold text-cloud">
                    {formatMoney(orderState.refund.refundAmount)}
                  </p>
                </div>
              ) : null}
            </div>

            {orderState.refund.adminNote ? (
              <div className="mt-3 rounded-xl border border-hairline bg-white/5 p-3 text-xs text-mist">
                <p className="text-faint">Admin note</p>
                <p className="mt-1 text-cloud/95">
                  {orderState.refund.adminNote}
                </p>
              </div>
            ) : null}

            {orderState.refund.stripeRefundId ? (
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-mist">
                <span className="text-faint">Stripe refund id</span>
                <span className="font-mono text-mist/90">
                  {orderState.refund.stripeRefundId}
                </span>
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <section>
          <SectionLabel>Refund request</SectionLabel>
          <div className="mt-2 rounded-2xl border border-hairline bg-white/3 p-4">
            {!refundFormOpen ? (
              <>
                <p className="text-sm leading-relaxed text-mist">
                  Request a refund for this order. You&apos;ll see refund
                  details here once it&apos;s reviewed.
                </p>

                <div className="mt-4 flex items-center justify-end gap-2">
                  {refundRequestSent ? (
                    <Button type="button" size="sm" disabled>
                      Refund request submitted
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setRefundFormOpen(true)}
                      disabled={
                        (orderState.payment_status ?? "").toLowerCase() ===
                        "refunded"
                      }
                    >
                      Request refund
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!orderIdForRefund) {
                    toast.error("Order id missing. Please try again.");
                    return;
                  }
                  if (!policyConfirmed) {
                    toast.error(
                      "Please accept the refund policy and confirm you have read it.",
                      { id: "refund" },
                    );
                    return;
                  }
                  const reason = refundReason.trim();
                  if (!reason) {
                    toast.error("Please enter a reason for your refund.", {
                      id: "refund",
                    });
                    return;
                  }
                  if (refundFiles.length < 1) {
                    toast.error("Please upload at least one image.", {
                      id: "refund",
                    });
                    return;
                  }

                  setRefundSubmitting(true);
                  try {
                    const fd = new FormData();
                    fd.append("reason", reason);
                    for (const file of refundFiles) {
                      fd.append("image", file);
                    }

                    const res = await nextFetch<DashboardOrder>(
                      `/refund/${orderIdForRefund}`,
                      {
                        method: "POST",
                        body: fd,
                      },
                    );

                    if (!res.success) {
                      toast.error(
                        res.message || "Could not submit refund request.",
                        {
                          id: "refund",
                        },
                      );
                      return;
                    }

                    if (res.data) setOrderState(res.data);
                    router.refresh();

                    setRefundFormOpen(false);
                    setRefundRequestSent(true);
                    setRefundConfirmationOpen(true);

                    // If the API returns an approved/pending refund object
                    // immediately, we'll render it from `orderState.refund`.
                    if (res.data?.refund) setRefundRequestSent(false);
                  } catch {
                    toast.error("Network error. Please try again.", {
                      id: "refund",
                    });
                  } finally {
                    setRefundSubmitting(false);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-cloud">
                      Refund policy
                    </p>
                    <p className="mt-1 text-xs text-mist">
                      Open <span className="font-mono">/refund</span> in a new
                      tab and confirm below.
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      window.open("/refund", "_blank", "noopener,noreferrer");
                 
                    }}
                  >
                    Open /refund
                  </Button>
                </div>

                <label className="flex items-start gap-3 text-sm text-cloud select-none">
                  <input
                    type="checkbox"
                    checked={policyConfirmed}
                    disabled={refundSubmitting}
                    onChange={(e) => setPolicyConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-hairline-strong bg-white/3 accent-violet"
                  />
                  <span>
                    I have read the refund policy and understand the process.
                  </span>
                </label>

                <div className="space-y-2">
                  <Label htmlFor="refundReason">Reason</Label>
                  <Textarea
                    id="refundReason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Explain why you want a refund…"
                    rows={4}
                    disabled={refundSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundImages">Images (multiple)</Label>
                  <input
                    id="refundImages"
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={refundSubmitting}
                    onChange={(e) => {
                      const next = Array.from(e.target.files ?? []);
                      setRefundFiles(next);
                    }}
                    className="block w-full cursor-pointer rounded-xl border border-hairline bg-white/3 px-3 py-2 text-sm text-mist file:mr-4 file:rounded-lg file:border-0 file:bg-violet/20 file:px-3 file:py-2 file:text-sm file:font-medium file:text-violet-bright"
                  />
                  <p className="text-xs text-faint">
                    {refundFiles.length > 0
                      ? `${refundFiles.length} file(s) selected`
                      : "Add screenshots or proof to help review your request."}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRefundFormOpen(false)}
                    disabled={refundSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      refundSubmitting ||
                      !policyConfirmed ||
                      !refundReason.trim() ||
                      refundFiles.length < 1
                    }
                  >
                    {refundSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit refund request"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}

      <div className="space-y-1.5 border-t border-hairline pt-4 text-xs text-faint">
        <p>
          Placed on{" "}
          <span className="text-mist">{formatDate(orderState.createdAt)}</span>
        </p>
        {(orderState.payment_intent_id || orderState.transaction_id) && (
          <p
            className="truncate"
            title={orderState.payment_intent_id || orderState.transaction_id}
          >
            Payment ID{" "}
            <span className="font-mono text-mist/90">
              {orderState.payment_intent_id || orderState.transaction_id}
            </span>
          </p>
        )}
      </div>
      </div>

      <Modal
        open={refundConfirmationOpen}
        onClose={() => setRefundConfirmationOpen(false)}
        title="Refund request submitted"
        description="Thanks. We’ll review your request and update your order once processed."
        className="max-w-md"
      >
        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => setRefundConfirmationOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>
    </>
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
