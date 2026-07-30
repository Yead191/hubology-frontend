"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

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
  };
}

export function OrdersTable({ orders }: { orders: DashboardOrder[] }) {
  const [selected, setSelected] = React.useState<DashboardOrder | null>(null);
  const breakdown = selected?.price_breakdown;

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
              "Status",
              "Payment",
              "",
            ]}
          >
            {orders.map((o) => (
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
                <td className="px-4 py-3 text-cloud">
                  {formatMoney(
                    o.price_breakdown?.total_price ??
                      o.price_breakdown?.subtotal,
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
            ))}
          </DashboardTable>
        )}
      </DashboardPanel>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Order ${selected.order_id || ""}` : "Order"}
        description="Items, shipping, and payment breakdown."
        className="max-w-xl"
      >
        {selected ? (
          <div className="space-y-5">
            <ul className="space-y-3">
              {(selected.items ?? []).map((item, i) => {
                const image = getImageUrl(item.image);
                return (
                  <li
                    key={`${item.title}-${i}`}
                    className="flex gap-3 rounded-xl border border-hairline bg-white/3 p-3"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-hairline bg-ink">
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

            <div className="space-y-2 text-sm">
              <p className="font-medium text-cloud">Shipping</p>
              <p className="text-mist">{selected.formatted_address || "—"}</p>
              <p className="text-mist">
                Contact:{" "}
                {selected.contact_number ||
                  selected.address_breakdown?.contact_number ||
                  "—"}
              </p>
            </div>

            {breakdown ? (
              <div className="space-y-2 border-t border-hairline pt-4 text-sm">
                <BreakdownRow
                  label="Products"
                  value={breakdown.products_price}
                />
                <BreakdownRow label="Service fee" value={breakdown.serviceFee} />
                <BreakdownRow
                  label="Delivery"
                  value={breakdown.delivery_charge}
                />
                <BreakdownRow label="Tax" value={breakdown.tax} />
                {(breakdown.discount_amount ?? 0) > 0 ? (
                  <BreakdownRow
                    label="Discount"
                    value={-(breakdown.discount_amount ?? 0)}
                  />
                ) : null}
                <div className="flex justify-between border-t border-hairline pt-3 font-semibold text-cloud">
                  <span>Total</span>
                  <span className="text-violet-bright">
                    {formatMoney(breakdown.total_price ?? breakdown.subtotal)}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}

function BreakdownRow({ label, value }: { label: string; value?: number }) {
  if (value == null) return null;
  return (
    <div className="flex justify-between text-mist">
      <span>{label}</span>
      <span className="text-cloud">{formatMoney(value)}</span>
    </div>
  );
}
