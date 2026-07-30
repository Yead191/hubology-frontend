"use client";

import * as React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

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
  preferredDate?: string;
  preferredTime?: string;
  note?: string;
  price?: number;
  status?: string;
  paymentStatus?: string;
  paymentIntentId?: string;
  createdAt?: string;
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
              "Status",
              "Payment",
              "",
            ]}
          >
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-white/2">
                <td className="px-4 py-3 font-medium text-cloud">
                  {b.service?.title || "Service"}
                </td>
                <td className="px-4 py-3 text-mist">
                  {formatDate(b.preferredDate)}
                </td>
                <td className="px-4 py-3 text-mist">{b.preferredTime || "—"}</td>
                <td className="px-4 py-3 text-cloud">{formatMoney(b.price)}</td>
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
            ))}
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
        description="Full booking and payment information."
        className="max-w-lg"
      >
        {selected ? (
          <dl className="space-y-3 text-sm">
            <Row label="Preferred date" value={formatDate(selected.preferredDate)} />
            <Row label="Preferred time" value={selected.preferredTime || "—"} />
            <Row label="Price" value={formatMoney(selected.price)} />
            <Row label="Status" value={selected.status || "—"} />
            <Row label="Payment" value={selected.paymentStatus || "—"} />
            <Row label="Booked on" value={formatDate(selected.createdAt)} />
            <Row
              label="Payment intent"
              value={selected.paymentIntentId || "—"}
            />
            <div>
              <dt className="text-mist">Note</dt>
              <dd className="mt-1 rounded-xl border border-hairline bg-white/3 px-3 py-2 text-cloud">
                {selected.note?.trim() || "No note provided."}
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-hairline pb-3">
      <dt className="text-mist">{label}</dt>
      <dd className="text-right font-medium text-cloud break-all">{value}</dd>
    </div>
  );
}
