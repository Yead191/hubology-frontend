"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Download,
  ShieldCheck,
  Check,
  Loader2,
  Lock,
  TicketPercent,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import type { Book } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { bookId, bookFileUrl } from "@/lib/book";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

/** Pulls the Stripe Checkout URL from common API response shapes. */
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

function looksUnauthorized(response: {
  message?: string;
  error?: unknown;
}) {
  const msg = `${response.message ?? ""} ${typeof response.error === "string" ? response.error : ""}`.toLowerCase();
  return (
    msg.includes("unauthorized") ||
    msg.includes("unauthenticated") ||
    msg.includes("not authenticated") ||
    msg.includes("please login") ||
    msg.includes("please log in") ||
    msg.includes("jwt") ||
    msg.includes("token")
  );
}

function hasAccessToken() {
  return Boolean(Cookies.get("accessToken"));
}

/** Purchase / download card. Shows "Buy" until owned, then "Download". */
export function BookBuyPanel({
  book,
  purchased = false,
}: {
  book: Book;
  purchased?: boolean;
}) {
  const pathname = usePathname();
  const id = bookId(book);
  const fileUrl = bookFileUrl(book);
  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [paying, setPaying] = React.useState(false);
  const [coupon, setCoupon] = React.useState("");
  const [couponOpen, setCouponOpen] = React.useState(false);
  // Same pattern as booking modal: auth = accessToken cookie, checked on the client.
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(hasAccessToken());
  }, []);

  function requireLogin() {
    setLoginOpen(true);
  }

  async function handleBuy() {
    // Always re-read the cookie at click time — never trust a stale prop/state alone.
    if (!hasAccessToken()) {
      setIsLoggedIn(false);
      requireLogin();
      return;
    }
    setIsLoggedIn(true);

    setPaying(true);
    try {
      const couponCode = coupon.trim();
      const response = await nextFetch(`/books/purchase/${id}`, {
        method: "POST",
        body: {
          ...(couponCode ? { coupon: couponCode } : {}),
        },
      });

      if (!response?.success) {
        if (looksUnauthorized(response)) {
          requireLogin();
          setPaying(false);
          return;
        }
        toast.error(response?.message || "Could not start checkout.", {
          id: "book-purchase",
        });
        setPaying(false);
        return;
      }

      const stripeUrl = resolveStripeUrl(response.data);
      if (!stripeUrl) {
        toast.error("Payment link unavailable. Please try again.", {
          id: "book-purchase",
        });
        setPaying(false);
        return;
      }

      window.location.href = stripeUrl;
    } catch (err) {
      console.error("Book purchase error:", err);
      toast.error("Network error. Please try again.", { id: "book-purchase" });
      setPaying(false);
    }
  }

  return (
    <div className="border-gradient glow-soft rounded-4xl bg-panel/60 p-6 sm:p-7">
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-bold text-cloud">
          {formatPrice(book.price)}
        </span>
        <span className="text-sm text-mist">· one-time</span>
      </div>
      <p className="mt-2 text-sm text-mist">
        Buy once, download the full PDF and keep it forever.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        {purchased ? (
          <>
            <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <Check className="h-3.5 w-3.5" /> In your library
            </span>
            {fileUrl ? (
              <Button asChild size="lg" className="w-full">
                <a
                  href={fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            ) : (
              <p className="text-center text-sm text-mist">
                Purchase found, but the file isn&apos;t available yet.
              </p>
            )}
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-hairline bg-white/3 p-3.5">
              <button
                type="button"
                onClick={() => setCouponOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-3 text-left"
                aria-expanded={couponOpen}
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium text-cloud">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet/15 text-violet-bright">
                    <TicketPercent className="h-4 w-4" />
                  </span>
                  Have a coupon?
                </span>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    coupon.trim()
                      ? "text-violet-bright"
                      : "text-faint hover:text-mist",
                  )}
                >
                  {coupon.trim() ? "Applied" : couponOpen ? "Hide" : "Add"}
                </span>
              </button>

              {couponOpen || coupon.trim() ? (
                <div className="mt-3 space-y-2 border-t border-hairline pt-3">
                  <Label htmlFor="book-coupon" className="text-xs text-mist">
                    Coupon code{" "}
                    <span className="font-normal text-faint">(optional)</span>
                  </Label>
                  <Input
                    id="book-coupon"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="e.g. SUMMER25"
                    disabled={paying}
                    className="h-11 border-hairline bg-ink/40"
                  />
                  {coupon.trim() ? (
                    <p className="text-xs text-mist">
                      Code{" "}
                      <span className="font-medium text-violet-bright">
                        {coupon.trim()}
                      </span>{" "}
                      will be applied at checkout.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleBuy}
              disabled={paying}
              className="w-full"
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to
                  secure checkout…
                </>
              ) : isLoggedIn ? (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Buy now
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign in to buy
                </>
              )}
            </Button>
          </>
        )}
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-faint">
        <ShieldCheck className="h-3.5 w-3.5 text-violet-bright" />
        Secure checkout · instant download
      </p>

      <Modal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        title="Sign in to buy"
        description="Purchases are tied to your Hubology account so your library and downloads stay in one place."
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <Lock className="h-6 w-6" />
          </span>
          <p className="max-w-xs text-sm text-mist">
            Sign in to buy <span className="text-cloud">{book.title}</span> and
            download it instantly.
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
    </div>
  );
}
