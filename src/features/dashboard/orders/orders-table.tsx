"use client";

import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DashboardPanel,
  DashboardTable,
  EmptyDash,
  StatusPill,
  formatDate,
  formatMoney,
  statusTone,
} from "@/features/dashboard/ui";
import type { DashboardOrder } from "./types";
import { hasDiscount, orderTotal } from "./helpers";

export function OrdersTable({ orders }: { orders: DashboardOrder[] }) {
  return (
    <DashboardPanel
      title="Order history"
      description="Office supply orders, shipments, and refunds."
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
          headers={["Order", "Date", "Items", "Total", "Status", "Payment", ""]}
        >
          {orders.map((o) => {
            const total = orderTotal(o);
            const subtotal = o.price_breakdown?.subtotal;
            const discounted = hasDiscount(o);

            return (
              <tr
                key={o._id}
                className="group transition-colors hover:bg-white/3"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-hairline bg-white/3 text-violet-bright">
                      <Package className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium text-cloud">
                      {o.order_id || o._id.slice(-6)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-mist">
                  {formatDate(o.createdAt)}
                </td>
                <td className="px-4 py-3.5 text-mist">
                  {o.total_items ?? o.items?.length ?? 0}
                </td>
                <td className="px-4 py-3.5">
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
                <td className="px-4 py-3.5">
                  <StatusPill
                    value={o.status || "—"}
                    tone={statusTone(o.status)}
                  />
                </td>
                <td className="px-4 py-3.5">
                  <StatusPill
                    value={o.payment_status || "—"}
                    tone={statusTone(o.payment_status)}
                  />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/dashboard/orders/${o._id}`}>
                      View
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </Button>
                </td>
              </tr>
            );
          })}
        </DashboardTable>
      )}
    </DashboardPanel>
  );
}
