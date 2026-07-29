"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, CalendarClock, ShieldCheck } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import type { ServicePackage } from "@/types";
import { formatPrice } from "@/lib/utils";
import { bookingSchema, type BookingValues } from "@/lib/validators";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";

// Change this if your create-booking route differs. On success the API is
// expected to return a Stripe Checkout URL on `data` (see resolveStripeUrl).
const BOOKING_ENDPOINT = "/bookings";

/** Pulls the Stripe Checkout URL out of the various shapes an API might return. */
function resolveStripeUrl(data: unknown): string | undefined {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const candidate =
      d.url ?? d.checkoutUrl ?? d.paymentUrl ?? d.stripeUrl ?? d.sessionUrl;
    if (typeof candidate === "string") return candidate;
  }
  return undefined;
}

/** Booking intake modal. Requires login; contact details come from the token. */
export function BookingModal({
  service,
  open,
  onClose,
}: {
  service: ServicePackage;
  open: boolean;
  onClose: () => void;
}) {
  const [redirecting, setRedirecting] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const today = new Date().toISOString().slice(0, 10);
  // Send the user back to the page they were booking from after they log in.
  const pathname = usePathname();
  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;

  // Auth is driven by the accessToken cookie set at login. Re-check on open.
  React.useEffect(() => {
    if (open) setIsLoggedIn(Boolean(Cookies.get("accessToken")));
  }, [open]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { date: "", time: "", note: "" },
  });

  React.useEffect(() => {
    if (open) reset({ date: "", time: "", note: "" });
  }, [open, reset]);

  async function onSubmit(values: BookingValues) {
    if (!service._id) {
      toast.error("This service is unavailable to book right now.", {
        id: "booking",
      });
      return;
    }

    setRedirecting(true);
    try {
      const response = await nextFetch(BOOKING_ENDPOINT, {
        method: "POST",
        body: {
          service: service._id,
          // date input -> ISO at UTC midnight (e.g. 2026-08-15T00:00:00.000Z)
          preferredDate: new Date(values.date).toISOString(),
          preferredTime: values.time,
          note: values.note ?? "",
        },
      });

      if (!response?.success) {
        toast.error(response?.message || "Could not create your booking.", {
          id: "booking",
        });
        setRedirecting(false);
        return;
      }

      const stripeUrl = resolveStripeUrl(response.data);
      if (!stripeUrl) {
        toast.error("Payment link unavailable. Please try again.", {
          id: "booking",
        });
        setRedirecting(false);
        return;
      }

      // Hand off to Stripe Checkout. Keep the spinner during navigation.
      window.location.href = stripeUrl;
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Network error. Please try again.", { id: "booking" });
      setRedirecting(false);
    }
  }

  // ── Login gate ─────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Sign in to book"
        description="Booking a service requires a Hubology account so we can keep your order and updates in one place."
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <Lock className="h-6 w-6" />
          </span>
          <p className="max-w-xs text-sm text-mist">
            Sign in to book <span className="text-cloud">{service.title}</span>{" "}
            — it only takes a moment.
          </p>
          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href={loginHref}>Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/join">Create an account</Link>
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={redirecting ? () => {} : onClose}
      title={`Book ${service.title}`}
      description="Pick a time that works, then continue to secure checkout."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Order summary */}
        <div className="flex items-center justify-between rounded-2xl border border-hairline bg-white/3 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-cloud">
              {service.title}
            </span>
            <span className="text-xs text-faint">
              {service.price.frequency}
            </span>
          </div>
          <span className="font-display text-xl font-bold text-cloud">
            {formatPrice(service.price.amount, service.price.currency)}
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Preferred date</Label>
            <Input
              id="date"
              type="date"
              min={today}
              aria-invalid={!!errors.date}
              {...register("date")}
            />
            <FieldError message={errors.date?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="time">Preferred time</Label>
            <Input
              id="time"
              type="time"
              aria-invalid={!!errors.time}
              {...register("time")}
            />
            <FieldError message={errors.time?.message} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="note">
            Add a note <span className="text-faint">(optional)</span>
          </Label>
          <Textarea
            id="note"
            rows={3}
            placeholder="e.g. Forming a 2-person LLC in Delaware, need it filed this month."
            aria-invalid={!!errors.note}
            {...register("note")}
          />
          <FieldError message={errors.note?.message} />
        </div>

        <Button type="submit" size="lg" disabled={redirecting} className="w-full">
          {redirecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to secure
              checkout…
            </>
          ) : (
            <>
              <CalendarClock className="h-4 w-4" />
              Continue to secure checkout
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-faint">
          <ShieldCheck className="h-3.5 w-3.5 text-violet-bright" />
          Payments are processed securely by Stripe.
        </p>
      </form>
    </Modal>
  );
}
