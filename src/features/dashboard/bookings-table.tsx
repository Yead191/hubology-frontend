"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Eye,
  Phone,
  Receipt,
  TicketPercent,
} from "lucide-react";

import { cn } from "@/lib/utils";
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

export interface DashboardBooking {
  _id: string;
  service?: { _id?: string; title?: string };
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string | null;
  };
  preferredDate?: string;
  preferredTime?: string;
  phone?: string;
  note?: string;
  /** Original service price before discount. */
  price?: number;
  /** Amount charged after coupon (falls back to `price`). */
  updatedPrice?: number;
  coupon?: string;
  discountType?: string;
  discountAmount?: number;
  discountPercentage?: number;
  status?: string;
  paymentStatus?: string;
  paymentIntentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

function paidAmount(b: DashboardBooking) {
  return b.updatedPrice ?? b.price;
}

function hasDiscount(b: DashboardBooking) {
  const coupon = b.coupon?.trim();
  if (coupon) return true;
  if ((b.discountAmount ?? 0) > 0) return true;
  if (
    b.price != null &&
    b.updatedPrice != null &&
    b.updatedPrice < b.price
  ) {
    return true;
  }
  return false;
}

function discountLabel(b: DashboardBooking) {
  if (!hasDiscount(b)) return "—";
  const parts: string[] = [];
  if ((b.discountPercentage ?? 0) > 0) {
    parts.push(`${b.discountPercentage}%`);
  }
  if ((b.discountAmount ?? 0) > 0) {
    parts.push(formatMoney(b.discountAmount));
  }
  if (parts.length === 0) return "Applied";
  return parts.join(" · ");
}

export function BookingsTable({ bookings }: { bookings: DashboardBooking[] }) {
  const [selected, setSelected] = React.useState<DashboardBooking | null>(null);

  return (
    <>
      <DashboardPanel
        title="My bookings"
        description="Service sessions you’ve purchased."
      >
        {bookings.length === 0 ? (
          <EmptyDash
            title="No bookings yet"
            message="Browse services and book a session with a verified expert."
          />
        ) : (
          <DashboardTable
            headers={[
              "Service",
              "Date",
              "Time",
              "Price",
              "Coupon",
              "Status",
              "Payment",
              "",
            ]}
          >
            {bookings.map((b) => {
              const paid = paidAmount(b);
              const discounted = hasDiscount(b);
              const coupon = b.coupon?.trim();

              return (
                <tr key={b._id} className="hover:bg-white/2">
                  <td className="px-4 py-3 font-medium text-cloud">
                    {b.service?.title || "Service"}
                  </td>
                  <td className="px-4 py-3 text-mist">
                    {formatDate(b.preferredDate)}
                  </td>
                  <td className="px-4 py-3 text-mist">
                    {b.preferredTime || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-cloud">
                        {formatMoney(paid)}
                      </span>
                      {discounted && b.price != null && paid !== b.price ? (
                        <span className="text-xs text-faint line-through">
                          {formatMoney(b.price)}
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
                      value={b.status || "—"}
                      tone={statusTone(b.status)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      value={b.paymentStatus || "—"}
                      tone={statusTone(b.paymentStatus)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelected(b)}
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </DashboardTable>
        )}
        {bookings.length === 0 ? (
          <div className="mt-4 flex justify-center">
            <Button asChild size="sm">
              <Link href="/services">Browse services</Link>
            </Button>
          </div>
        ) : null}
      </DashboardPanel>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.service?.title || "Booking details"}
        description="Schedule, pricing, and payment for this session."
        className="max-w-md"
      >
        {selected ? <BookingDetailModal booking={selected} /> : null}
      </Modal>
    </>
  );
}

function BookingDetailModal({ booking }: { booking: DashboardBooking }) {
  const paid = paidAmount(booking);
  const discounted = hasDiscount(booking);
  const coupon = booking.coupon?.trim();
  const note = booking.note?.trim();

  return (
    <div className="space-y-5">
      {/* Amount + status */}
      <div className="relative overflow-hidden rounded-2xl border border-hairline-strong bg-white/4 p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-violet/25 blur-3xl"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              Amount paid
            </p>
            <p className="mt-1 font-display text-3xl font-bold tracking-tight text-cloud">
              {formatMoney(paid)}
            </p>
            {discounted &&
            booking.price != null &&
            paid != null &&
            paid < booking.price ? (
              <p className="mt-1 text-sm text-mist">
                <span className="line-through text-faint">
                  {formatMoney(booking.price)}
                </span>
                <span className="mx-1.5 text-faint">·</span>
                Saved{" "}
                {formatMoney(
                  booking.discountAmount ?? booking.price - paid,
                )}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusPill
              value={booking.status || "—"}
              tone={statusTone(booking.status)}
            />
            <StatusPill
              value={booking.paymentStatus || "—"}
              tone={statusTone(booking.paymentStatus)}
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <section>
        <SectionLabel>Schedule</SectionLabel>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <InfoTile
            icon={CalendarDays}
            label="Preferred date"
            value={formatDate(booking.preferredDate)}
          />
          <InfoTile
            icon={Clock3}
            label="Preferred time"
            value={booking.preferredTime || "—"}
          />
          <InfoTile
            icon={Phone}
            label="Contact"
            value={booking.phone || "—"}
            className="sm:col-span-2"
          />
        </div>
      </section>

      {/* Pricing */}
      <section>
        <SectionLabel>Pricing</SectionLabel>
        <div className="mt-2 rounded-2xl border border-hairline bg-white/3 p-4">
          <PriceLine label="Original price" value={formatMoney(booking.price)} />
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
          {discounted ? (
            <PriceLine
              label="Discount"
              value={discountLabel(booking)}
              accent
            />
          ) : null}
          <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cloud">
              <Receipt className="h-3.5 w-3.5 text-violet-bright" />
              Total paid
            </span>
            <span className="font-display text-lg font-bold text-cloud">
              {formatMoney(paid)}
            </span>
          </div>
        </div>
      </section>

      {/* Note */}
      <section>
        <SectionLabel>Note</SectionLabel>
        <p
          className={cn(
            "mt-2 rounded-2xl border border-hairline px-4 py-3 text-sm leading-relaxed",
            note ? "bg-white/3 text-cloud" : "bg-transparent text-faint",
          )}
        >
          {note || "No note provided."}
        </p>
      </section>

      {/* Meta */}
      <div className="space-y-1.5 border-t border-hairline pt-4 text-xs text-faint">
        <p>
          Booked on{" "}
          <span className="text-mist">{formatDate(booking.createdAt)}</span>
        </p>
        {booking.paymentIntentId ? (
          <p className="truncate" title={booking.paymentIntentId}>
            Payment ID{" "}
            <span className="font-mono text-mist/90">
              {booking.paymentIntentId}
            </span>
          </p>
        ) : null}
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

function InfoTile({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-hairline bg-white/3 px-3.5 py-3",
        className,
      )}
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-faint">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-cloud">{value}</p>
      </div>
    </div>
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
