"use client";

import * as React from "react";
import { ShoppingCart, Download, ShieldCheck, Check } from "lucide-react";

import type { Book } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStorePurchases } from "@/features/store/purchase-context";
import { BookCheckoutModal } from "./book-checkout-modal";

/** Purchase / download card. Shows "Buy" until owned, then "Download". */
export function BookBuyPanel({ book }: { book: Book }) {
  const { hasPurchased } = useStorePurchases();
  const [open, setOpen] = React.useState(false);
  const owned = hasPurchased(book.slug);

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
        {owned ? (
          <>
            <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <Check className="h-3.5 w-3.5" /> In your library
            </span>
            <Button asChild size="lg" className="w-full">
              <a href={book.fileUrl} download>
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </>
        ) : (
          <Button
            type="button"
            size="lg"
            onClick={() => setOpen(true)}
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy now
          </Button>
        )}
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-faint">
        <ShieldCheck className="h-3.5 w-3.5 text-violet-bright" />
        Secure checkout · instant download
      </p>

      <BookCheckoutModal book={book} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
