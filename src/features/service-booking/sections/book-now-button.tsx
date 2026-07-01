"use client";

import * as React from "react";

import type { ServicePackage } from "@/types";
import { Button, type ButtonProps } from "@/components/ui/button";
import { BookingModal } from "./booking-modal";

/**
 * Client island: renders a "Book now" button that opens the booking
 * modal for a service. Usable inside server-rendered cards/pages.
 */
export function BookNowButton({
  service,
  children = "Book now",
  ...buttonProps
}: {
  service: ServicePackage;
  children?: React.ReactNode;
} & ButtonProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} {...buttonProps}>
        {children}
      </Button>
      <BookingModal
        service={service}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
