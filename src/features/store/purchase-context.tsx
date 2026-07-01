"use client";

import * as React from "react";

interface PurchaseContextValue {
  /** True once the given book slug has been purchased this session. */
  hasPurchased: (slug: string) => boolean;
  purchase: (slug: string) => void;
}

const PurchaseContext = React.createContext<PurchaseContextValue | null>(null);

/**
 * Frontend-only record of purchased books, held in memory (resets on
 * reload, matching the demo auth/membership pattern). Gates the PDF
 * download until "payment" completes. Swap for real entitlements later.
 */
export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [owned, setOwned] = React.useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const purchase = React.useCallback((slug: string) => {
    setOwned((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
  }, []);

  const hasPurchased = React.useCallback(
    (slug: string) => owned.has(slug),
    [owned],
  );

  const value = React.useMemo<PurchaseContextValue>(
    () => ({ hasPurchased, purchase }),
    [hasPurchased, purchase],
  );

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function useStorePurchases() {
  const ctx = React.useContext(PurchaseContext);
  if (!ctx)
    throw new Error("useStorePurchases must be used within a PurchaseProvider");
  return ctx;
}
