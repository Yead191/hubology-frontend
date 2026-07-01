"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, CalendarClock, ShieldCheck } from "lucide-react";

import type { ServicePackage } from "@/types";
import { formatPrice } from "@/lib/utils";
import { bookingSchema, type BookingValues } from "@/lib/validators";
import { useAuth } from "@/components/auth/auth-context";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";

/** Booking intake modal. Requires login; prefills contact from the user. */
export function BookingModal({
  service,
  open,
  onClose,
}: {
  service: ServicePackage;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [redirecting, setRedirecting] = React.useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { fullName: "", email: "", date: "", time: "", notes: "" },
  });

  // Prefill contact details from the signed-in user each time we open.
  React.useEffect(() => {
    if (open && user) {
      reset({
        fullName: user.name,
        email: user.email,
        date: "",
        time: "",
        notes: "",
      });
    }
  }, [open, user, reset]);

  async function onSubmit(values: BookingValues) {
    setRedirecting(true);

    // ── Stripe integration point ───────────────────────────────
    // In production, POST these details to your API to create a
    // Checkout Session, then redirect to session.url:
    //   const { url } = await createCheckoutSession({ slug: service.slug, ...values })
    //   window.location.href = url
    // Stripe collects card + billing and redirects back to success_url.
    // Here we simulate that round-trip and land on the confirmation.
    const reference = `HB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const params = new URLSearchParams({
      service: service.slug,
      ref: reference,
      date: values.date,
      time: values.time,
    });

    await new Promise((r) => setTimeout(r, 1200));
    router.push(`/booking/confirmation?${params.toString()}`);
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
              <Link href="/login">Sign in</Link>
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
      description="Tell us a little about your needs, then continue to secure checkout."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Order summary */}
        <div className="flex items-center justify-between rounded-2xl border border-hairline bg-white/[0.03] px-4 py-3">
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
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            <FieldError message={errors.fullName?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

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
          <Label htmlFor="notes">Briefly, what do you need?</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="e.g. Forming a 2-person LLC in Delaware, need it filed this month."
            aria-invalid={!!errors.notes}
            {...register("notes")}
          />
          <FieldError message={errors.notes?.message} />
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
