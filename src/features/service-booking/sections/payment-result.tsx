import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Home,
  BookOpen,
  ShoppingBag,
  Crown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";

type PaymentKind = "service" | "digital" | "checkout" | "membership";

interface PaymentResultProps {
  status: "success" | "failed";
  sessionId?: string;
  type?: string;
}

function resolveKind(type?: string): PaymentKind {
  const t = (type ?? "").toLowerCase();
  if (t.includes("membership") || t.includes("subscription")) {
    return "membership";
  }
  if (t.includes("checkout") || t.includes("order") || t.includes("office")) {
    return "checkout";
  }
  if (
    t.includes("digital") ||
    t.includes("product") ||
    t.includes("book") ||
    t.includes("store")
  ) {
    return "digital";
  }
  return "service";
}

const COPY = {
  service: {
    success: {
      eyebrow: "Payment confirmed",
      title: "You're all booked",
      message:
        "Your payment went through and your session is confirmed. A receipt and the booking details are on their way to your inbox.",
    },
    failed: {
      eyebrow: "Payment not completed",
      title: "Something went wrong",
      message:
        "Your payment was cancelled or didn't go through, so we haven't charged you. You can try booking again whenever you're ready.",
    },
  },
  digital: {
    success: {
      eyebrow: "Payment confirmed",
      title: "Your book is unlocked",
      message:
        "Thanks for your purchase. The digital product is now in your library — you can download the PDF anytime from the product page.",
    },
    failed: {
      eyebrow: "Payment not completed",
      title: "Purchase incomplete",
      message:
        "Your payment was cancelled or didn't go through, so we haven't charged you. You can return to the store and try again.",
    },
  },
  checkout: {
    success: {
      eyebrow: "Payment confirmed",
      title: "Order placed",
      message:
        "Thanks for your order. Your payment went through and we're preparing your supplies for shipment. A receipt is on its way to your inbox.",
    },
    failed: {
      eyebrow: "Payment not completed",
      title: "Checkout incomplete",
      message:
        "Your payment was cancelled or didn't go through, so we haven't charged you. Your cart is still available if you'd like to try again.",
    },
  },
  membership: {
    success: {
      eyebrow: "Payment confirmed",
      title: "Welcome to the hub",
      message:
        "Your membership is active. You now have access to the community forum and member perks — a receipt is on its way to your inbox.",
    },
    failed: {
      eyebrow: "Payment not completed",
      title: "Membership not activated",
      message:
        "Your payment was cancelled or didn't go through, so we haven't charged you. You can pick a plan again whenever you're ready.",
    },
  },
} as const;

function TypeIcon({ kind }: { kind: PaymentKind }) {
  if (kind === "checkout")
    return <ShoppingBag className="h-3.5 w-3.5 text-violet-bright" />;
  if (kind === "membership")
    return <Crown className="h-3.5 w-3.5 text-violet-bright" />;
  return <BookOpen className="h-3.5 w-3.5 text-violet-bright" />;
}

export function PaymentResult({
  status,
  sessionId,
  type,
}: PaymentResultProps) {
  const kind = resolveKind(type);
  const c = COPY[kind][status];
  const Icon = status === "success" ? CheckCircle2 : XCircle;
  const iconWrap =
    status === "success"
      ? "bg-brand-gradient text-white"
      : "bg-destructive/15 text-destructive";
  const glow =
    status === "success"
      ? "shadow-[0_20px_60px_-15px_rgba(129,49,240,0.9)]"
      : "shadow-[0_20px_60px_-15px_rgba(240,67,106,0.6)]";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      <Aurora
        animated
        className={cn(
          "-top-16 left-1/2 h-128 w-152 -translate-x-1/2",
          status === "success" ? "opacity-45" : "opacity-25",
        )}
      />

      <div className="border-gradient relative w-full max-w-md rounded-4xl bg-panel/50 p-8 text-center glow-soft sm:p-10">
        <span
          className={cn(
            "mx-auto grid h-20 w-20 place-items-center rounded-3xl",
            iconWrap,
            glow,
          )}
        >
          <Icon className="h-10 w-10" />
        </span>

        <span className="eyebrow mt-6 block">{c.eyebrow}</span>
        <h1 className="mt-2 text-3xl font-bold text-cloud">{c.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">{c.message}</p>

        {type ? (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/3 px-3 py-1 text-xs text-mist">
            <TypeIcon kind={kind} />
            {type}
          </p>
        ) : null}

        {sessionId ? (
          <p className="mt-5 truncate rounded-xl border border-hairline bg-white/3 px-4 py-2.5 text-xs text-faint">
            Reference: <span className="text-mist">{sessionId}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-2.5">
          {status === "success" ? (
            kind === "digital" ? (
              <>
                <Button asChild size="lg" className="w-full">
                  <Link href="/store">
                    Back to store <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4" /> Back to home
                  </Link>
                </Button>
              </>
            ) : kind === "checkout" ? (
              <>
                <Button asChild size="lg" className="w-full">
                  <Link href="/office-supplies">
                    Continue shopping <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4" /> Back to home
                  </Link>
                </Button>
              </>
            ) : kind === "membership" ? (
              <>
                <Button asChild size="lg" className="w-full">
                  <Link href="/membership">
                    View your plan <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/forum">Enter the forum</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="w-full">
                  <Link href="/dashboard">
                    Go to dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/services">Browse more services</Link>
                </Button>
              </>
            )
          ) : kind === "digital" ? (
            <>
              <Button asChild size="lg" className="w-full">
                <Link href="/store">
                  Try again in store <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4" /> Back to home
                </Link>
              </Button>
            </>
          ) : kind === "checkout" ? (
            <>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                  Return to checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/office-supplies">Back to supplies</Link>
              </Button>
            </>
          ) : kind === "membership" ? (
            <>
              <Button asChild size="lg" className="w-full">
                <Link href="/membership">
                  Try again <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4" /> Back to home
                </Link>
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
