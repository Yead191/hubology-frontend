"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Lock, ShieldCheck, CheckCircle2, Download } from "lucide-react";

import type { Book } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { BookCover2D } from "./book-cover";
import { useStorePurchases } from "@/features/store/purchase-context";

export function BookCheckoutModal({
  book,
  open,
  onClose,
}: {
  book: Book;
  open: boolean;
  onClose: () => void;
}) {
  const { isLoggedIn } = useAuth();
  const { purchase, hasPurchased } = useStorePurchases();
  const [paying, setPaying] = React.useState(false);
  const owned = hasPurchased(book.slug);

  async function handlePay() {
    setPaying(true);
    // ── Stripe integration point ───────────────────────────────
    // POST to your API to create a Checkout Session for this book,
    // then redirect: window.location.href = session.url. Stripe's
    // success_url would return here / to a confirmation route. We
    // simulate that round-trip and grant the entitlement locally.
    await new Promise((r) => setTimeout(r, 1200));
    purchase(book.slug);
    setPaying(false);
  }

  // ── Login gate ─────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <Modal
        open={open}
        onClose={onClose}
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

  // ── Success state ──────────────────────────────────────────
  if (owned) {
    return (
      <Modal open={open} onClose={onClose} title="Payment successful">
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="max-w-xs text-sm text-mist">
            <span className="text-cloud">{book.title}</span> is now in your
            library. Your download is ready.
          </p>
          <Button asChild size="lg" className="w-full">
            <a href={book.fileUrl} download>
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-mist transition-colors hover:text-cloud"
          >
            Done
          </button>
        </div>
      </Modal>
    );
  }

  // ── Checkout ───────────────────────────────────────────────
  return (
    <Modal
      open={open}
      onClose={paying ? () => {} : onClose}
      title={`Buy ${book.title}`}
      description="Complete your purchase to unlock the download."
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4 rounded-2xl border border-hairline bg-white/[0.03] p-3">
          <BookCover2D book={book} sizes="80px" className="w-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cloud">
              {book.title}
            </p>
            <p className="truncate text-xs text-faint">{book.subtitle}</p>
          </div>
          <span className="font-display text-xl font-bold text-cloud">
            {formatPrice(book.price)}
          </span>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={handlePay}
          disabled={paying}
          className="w-full"
        >
          {paying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to secure
              checkout…
            </>
          ) : (
            `Pay ${formatPrice(book.price)}`
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-faint">
          <ShieldCheck className="h-3.5 w-3.5 text-violet-bright" />
          Payments are processed securely by Stripe.
        </p>
      </div>
    </Modal>
  );
}
