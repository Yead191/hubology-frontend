"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Lightweight accessible modal — portalled to <body>, closes on
 * Escape or backdrop click, locks page scroll while open, and
 * moves focus to the panel. Pure CSS transitions (no animation lib).
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog for keyboard + screen-reader users.
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-120 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <button
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onClose}
        className="loader-in absolute inset-0 cursor-default bg-ink/80 backdrop-blur-sm"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "loader-in relative w-full max-w-lg origin-bottom rounded-t-3xl border border-hairline-strong bg-panel/95 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] outline-none backdrop-blur-xl sm:rounded-3xl",
          "max-h-[92vh] overflow-y-auto",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h2
                id={titleId}
                className="font-display text-xl font-semibold tracking-tight text-cloud"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="mt-1 text-sm text-mist">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline bg-white/[0.03] text-mist transition-colors hover:bg-white/[0.08] hover:text-cloud"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className={cn(title || description ? "mt-5" : "")}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
