"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

import type { UserSubscription } from "@/types";
import { hasActiveSubscription } from "@/lib/forum";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

const DISMISS_KEY = "hubology:vendor-directory-sub-modal";

function isVendorRole(role?: string) {
  const r = (role ?? "").toLowerCase();
  return r === "vendor" || r === "expert";
}


export function VendorSubscriptionModal({
  role,
  subscription,
  isProfileVisible = false,
}: {
  role?: string;
  subscription?: UserSubscription | null;
  /** Admin grant — directory access without a paid vendor plan. */
  isProfileVisible?: boolean;
}) {
  // Nudge vendors without a plan (and without admin visibility) to subscribe.
  const needsSub =
    isVendorRole(role) &&
    !hasActiveSubscription(subscription) &&
    !isProfileVisible;

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!needsSub) {
      setOpen(false);
      return;
    }
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") {
        setOpen(false);
        return;
      }
    } catch {
      // sessionStorage unavailable — still show the modal
    }
    setOpen(true);
  }, [needsSub]);

  function handleClose() {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  if (!needsSub) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Vendor subscription required"
      description="Your expert profile stays hidden from the directory until you activate a vendor plan."
    >
      <div className="flex flex-col items-center gap-5 py-2 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
          <Crown className="h-6 w-6" />
        </span>
        <p className="max-w-sm text-sm leading-relaxed text-mist">
          Subscribe to a vendor plan to appear in the Hubology directory so
          members can find and contact you. You can keep browsing other experts
          in the meantime.
        </p>
        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/membership/vendor">
              View vendor plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            Continue browsing
          </Button>
        </div>
      </div>
    </Modal>
  );
}
