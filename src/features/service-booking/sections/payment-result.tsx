import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";

interface PaymentResultProps {
  status: "success" | "failed";
  /** Stripe session id, when present on the return URL. */
  sessionId?: string;
}

const COPY = {
  success: {
    eyebrow: "Payment confirmed",
    title: "You're all booked",
    message:
      "Your payment went through and your session is confirmed. A receipt and the booking details are on their way to your inbox.",
    icon: CheckCircle2,
    iconWrap: "bg-brand-gradient text-white",
    glow: "shadow-[0_20px_60px_-15px_rgba(129,49,240,0.9)]",
  },
  failed: {
    eyebrow: "Payment not completed",
    title: "Something went wrong",
    message:
      "Your payment was cancelled or didn't go through, so we haven't charged you. You can try booking again whenever you're ready.",
    icon: XCircle,
    iconWrap: "bg-destructive/15 text-destructive",
    glow: "shadow-[0_20px_60px_-15px_rgba(240,67,106,0.6)]",
  },
} as const;

export function PaymentResult({ status, sessionId }: PaymentResultProps) {
  const c = COPY[status];
  const Icon = c.icon;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      <Aurora
        animated
        className={cn(
          "-top-16 left-1/2 h-128 w-152 -translate-x-1/2",
          status === "success" ? "opacity-45" : "opacity-25",
        )}
      />

      <div className="border-gradient relative w-full max-w-md rounded-[2rem] bg-panel/50 p-8 text-center glow-soft sm:p-10">
        <span
          className={cn(
            "mx-auto grid h-20 w-20 place-items-center rounded-3xl",
            c.iconWrap,
            c.glow,
          )}
        >
          <Icon className="h-10 w-10" />
        </span>

        <span className="eyebrow mt-6 block">{c.eyebrow}</span>
        <h1 className="mt-2 text-3xl font-bold text-cloud">{c.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">{c.message}</p>

        {sessionId ? (
          <p className="mt-5 truncate rounded-xl border border-hairline bg-white/3 px-4 py-2.5 text-xs text-faint">
            Reference: <span className="text-mist">{sessionId}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-2.5">
          {status === "success" ? (
            <>
              <Button asChild size="lg" className="w-full">
                <Link href="/membership">
                  Go to dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/services">Browse more services</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg" className="w-full">
                <Link href="/services">
                  Try booking again <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4" /> Back to home
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
