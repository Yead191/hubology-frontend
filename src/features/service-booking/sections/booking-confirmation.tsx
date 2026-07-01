import Link from "next/link";
import {
  CheckCircle2,
  CalendarClock,
  Mail,
  MessagesSquare,
  ArrowRight,
} from "lucide-react";

import type { ServicePackage } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Deterministic "Jul 6, 2026" from a YYYY-MM-DD string (no locale/tz drift). */
function formatDate(value?: string) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** "14:30" → "2:30 PM". */
function formatTime(value?: string) {
  if (!value) return null;
  const [h, min] = value.split(":").map(Number);
  if (Number.isNaN(h)) return null;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(min ?? 0).padStart(2, "0")} ${period}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-mist">{label}</span>
      <span className="text-sm font-medium text-cloud">{value}</span>
    </div>
  );
}

const NEXT_STEPS = [
  {
    icon: Mail,
    text: "A receipt and booking confirmation are on their way to your inbox.",
  },
  {
    icon: CalendarClock,
    text: "Your expert will confirm the session at your preferred time.",
  },
  {
    icon: MessagesSquare,
    text: "Questions in the meantime? Ask in the community forum.",
  },
];

/** Success screen — where Stripe's success_url lands after payment. */
export function BookingConfirmation({
  service,
  reference,
  date,
  time,
}: {
  service?: ServicePackage;
  reference?: string;
  date?: string;
  time?: string;
}) {
  const prettyDate = formatDate(date);
  const prettyTime = formatTime(time);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pt-28 pb-20 sm:px-6">
      <Aurora
        animated
        className="left-1/2 top-1/3 h-[30rem] w-[38rem] -translate-x-1/2 opacity-40"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <div className="border-gradient rounded-3xl bg-panel/60 p-8 text-center glow-soft sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <CheckCircle2 className="h-8 w-8" />
          </span>

          <h1 className="mt-6 font-display text-3xl font-bold text-cloud">
            Booking confirmed
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-mist">
            {service
              ? `Your payment was successful and ${service.title} is booked. Here are your details.`
              : "Your payment was successful and your booking is confirmed."}
          </p>

          {reference && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-white/[0.03] px-4 py-2">
              <span className="text-xs text-faint">Booking ref</span>
              <span className="font-mono text-sm font-semibold tracking-wide text-violet-bright">
                {reference}
              </span>
            </div>
          )}

          {service && (
            <div className="mt-6 divide-y divide-hairline rounded-2xl border border-hairline bg-white/[0.02] px-5 text-left">
              <Row label="Service" value={service.title} />
              <Row
                label="Amount paid"
                value={formatPrice(
                  service.price.amount,
                  service.price.currency,
                )}
              />
              {prettyDate && <Row label="Preferred date" value={prettyDate} />}
              {prettyTime && <Row label="Preferred time" value={prettyTime} />}
            </div>
          )}

          {/* What happens next */}
          <ul className="mt-7 flex flex-col gap-3 text-left">
            {NEXT_STEPS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet/15 text-violet-bright">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-cloud/85">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/forum">
                Go to the forum
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">Book another service</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
