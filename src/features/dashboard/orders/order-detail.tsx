"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Hash, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  StatusPill,
  formatDate,
  formatMoney,
  statusTone,
} from "@/features/dashboard/ui";
import type { DashboardOrder } from "./types";
import { hasDiscount, orderDiscount, orderTotal } from "./helpers";
import { OrderItems } from "./order-items";
import { OrderPricing } from "./order-pricing";
import { OrderRefundPanel } from "./order-refund-panel";
import { OrderShipping } from "./order-shipping";

export function OrderDetail({ order: initial }: { order: DashboardOrder }) {
  const [order, setOrder] = React.useState(initial);

  React.useEffect(() => {
    setOrder(initial);
  }, [initial]);

  const paid = orderTotal(order);
  const discounted = hasDiscount(order);
  const discount = orderDiscount(order);
  const label = order.order_id || order._id.slice(-8);

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
              All orders
            </Link>
          </Button>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">
            Order details
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-cloud sm:text-3xl">
            {label}
          </h1>
          <p className="mt-1.5 text-sm text-mist">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      {/* Hero total */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline-strong bg-panel/60 p-6 backdrop-blur-md sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-violet/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              Order total
            </p>
            <p className="mt-1 font-display text-4xl font-bold tracking-tight text-cloud">
              {formatMoney(paid)}
            </p>
            {discounted && discount > 0 ? (
              <p className="mt-2 text-sm text-mist">
                {order.price_breakdown?.subtotal != null &&
                paid != null &&
                order.price_breakdown.subtotal > paid ? (
                  <>
                    <span className="text-faint line-through">
                      {formatMoney(order.price_breakdown.subtotal)}
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
          <div className="flex flex-wrap gap-4 text-sm text-mist">
            <span className="inline-flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5 text-faint" />
              {order.total_items ?? order.items?.length ?? 0} item
              {(order.total_items ?? order.items?.length ?? 0) === 1 ? "" : "s"}
            </span>
            {(order.payment_intent_id || order.transaction_id) && (
              <span
                className="inline-flex max-w-[220px] items-center gap-1.5 truncate"
                title={order.payment_intent_id || order.transaction_id}
              >
                <Hash className="h-3.5 w-3.5 shrink-0 text-faint" />
                <span className="truncate font-mono text-xs text-mist/90">
                  {order.payment_intent_id || order.transaction_id}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6 rounded-3xl border border-hairline bg-panel/40 p-5 backdrop-blur-md sm:p-6">
          <OrderItems items={order.items} />
          <OrderShipping order={order} />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-hairline bg-panel/40 p-5 backdrop-blur-md sm:p-6">
            <OrderPricing order={order} />
          </div>
          <div className="rounded-3xl border border-hairline bg-panel/40 p-5 backdrop-blur-md sm:p-6">
            <OrderRefundPanel order={order} onOrderChange={setOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
