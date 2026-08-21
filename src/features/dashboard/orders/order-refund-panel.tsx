"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill, formatMoney, statusTone } from "@/features/dashboard/ui";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import type { DashboardOrder } from "./types";
import {
  canRequestRefund,
  isRefundRequested,
  isRefunded,
} from "./helpers";
import { SectionLabel } from "./ui-bits";

export function OrderRefundPanel({
  order,
  onOrderChange,
}: {
  order: DashboardOrder;
  onOrderChange?: (next: DashboardOrder) => void;
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [policyConfirmed, setPolicyConfirmed] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);

  React.useEffect(() => {
    setFormOpen(false);
    setPolicyConfirmed(false);
    setReason("");
    setFiles([]);
    setSubmitting(false);
    setConfirmationOpen(false);
  }, [order._id]);

  if (order.refund) {
    return (
      <section>
        <SectionLabel>Refund</SectionLabel>
        <div className="relative mt-3 overflow-hidden rounded-2xl border border-sky-400/20 bg-sky-400/5 p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-sky-400/15 blur-3xl"
          />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <StatusPill
                value={order.refund.status || "—"}
                tone={statusTone(order.refund.status)}
              />
              <p className="text-sm text-mist">
                Type{" "}
                <span className="font-medium text-cloud">
                  {order.refund.refundType || "—"}
                </span>
              </p>
            </div>
            {order.refund.refundAmount != null ? (
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-faint">
                  Refund amount
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-cloud">
                  {formatMoney(order.refund.refundAmount)}
                </p>
              </div>
            ) : null}
          </div>

          {order.refund.adminNote ? (
            <div className="relative mt-4 rounded-xl border border-hairline bg-ink/40 p-3.5 text-sm">
              <p className="text-xs uppercase tracking-wide text-faint">
                Admin note
              </p>
              <p className="mt-1.5 leading-relaxed text-cloud/95">
                {order.refund.adminNote}
              </p>
            </div>
          ) : null}

          {order.refund.stripeRefundId ? (
            <p className="relative mt-3 truncate text-xs text-faint">
              Stripe ID{" "}
              <span className="font-mono text-mist">
                {order.refund.stripeRefundId}
              </span>
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  if (isRefundRequested(order) || !canRequestRefund(order)) {
    return (
      <section>
        <SectionLabel>Refund</SectionLabel>
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
            <RotateCcw className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-cloud">
              {isRefunded(order)
                ? "This order has been refunded"
                : "Refund request under review"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-mist">
              {isRefunded(order)
                ? "Refund details will appear here once processing completes."
                : "We've received your request. You'll see refund details here after admin approval."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <SectionLabel>Refund</SectionLabel>
        <div className="mt-3 rounded-2xl border border-hairline bg-white/3 p-4 sm:p-5">
          {!formOpen ? (
            <div className="flex flex-col gap-4  sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-cloud">Need a refund?</p>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-mist">
                  Submit a request with a short reason and supporting images.
                  We&apos;ll review it against our refund policy.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                className="shrink-0"
                onClick={() => setFormOpen(true)}
              >
                Request refund
              </Button>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!order._id) {
                  toast.error("Order id missing. Please try again.");
                  return;
                }
                if (!policyConfirmed) {
                  toast.error("Please confirm you have read the refund policy.", {
                    id: "refund",
                  });
                  return;
                }
                const trimmed = reason.trim();
                if (!trimmed) {
                  toast.error("Please enter a reason for your refund.", {
                    id: "refund",
                  });
                  return;
                }
                if (files.length < 1) {
                  toast.error("Please upload at least one image.", {
                    id: "refund",
                  });
                  return;
                }

                setSubmitting(true);
                try {
                  const fd = new FormData();
                  fd.append("reason", trimmed);
                  for (const file of files) fd.append("image", file);

                  const res = await nextFetch(`/refund/${order._id}`, {
                    method: "POST",
                    body: fd,
                  });

                  if (!res.success) {
                    toast.error(
                      res.message || "Could not submit refund request.",
                      { id: "refund" },
                    );
                    return;
                  }

                  // Keep existing order fields — refund POST often returns a thin payload.
                  const server = (
                    res.data && typeof res.data === "object"
                      ? (res.data as Partial<DashboardOrder>)
                      : {}
                  );
                  const next: DashboardOrder = {
                    ...order,
                    status: server.status || "Refund Requested",
                    payment_status:
                      server.payment_status || order.payment_status,
                    ...(server.refund ? { refund: server.refund } : {}),
                  };

                  onOrderChange?.(next);
                  setFormOpen(false);
                  setConfirmationOpen(true);
                  router.refresh();
                } catch {
                  toast.error("Network error. Please try again.", {
                    id: "refund",
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-ink/30 p-3.5  sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-cloud">Refund policy</p>
                  <p className="mt-0.5 text-xs text-mist">
                    Review the policy before submitting your request.
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/refund" target="_blank" rel="noopener noreferrer">
                    Open policy
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <label className="flex cursor-pointer select-none items-start gap-3 text-sm text-cloud">
                <input
                  type="checkbox"
                  checked={policyConfirmed}
                  disabled={submitting}
                  onChange={(e) => setPolicyConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-hairline-strong bg-white/3 accent-violet"
                />
                <span>
                  I have read the refund policy and understand the process.
                </span>
              </label>

              <div className="space-y-2">
                <Label htmlFor="refundReason">Reason</Label>
                <Textarea
                  id="refundReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you want a refund…"
                  rows={4}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundImages">Supporting images</Label>
                <label
                  htmlFor="refundImages"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline-strong bg-white/2 px-4 py-7 text-center transition-colors hover:bg-white/4"
                >
                  <ImagePlus className="h-5 w-5 text-violet-bright" />
                  <span className="text-sm font-medium text-cloud">
                    {files.length > 0
                      ? `${files.length} file${files.length === 1 ? "" : "s"} selected`
                      : "Upload images"}
                  </span>
                  <span className="text-xs text-faint">
                    JPG or PNG · multiple allowed
                  </span>
                  <input
                    id="refundImages"
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={submitting}
                    className="sr-only"
                    onChange={(e) => {
                      setFiles(Array.from(e.target.files ?? []));
                    }}
                  />
                </label>
                {files.length > 0 ? (
                  <ul className="space-y-1.5 pt-1">
                    {files.map((file) => (
                      <li
                        key={`${file.name}-${file.size}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-hairline bg-white/3 px-3 py-2 text-xs text-mist"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          disabled={submitting}
                          onClick={() =>
                            setFiles((prev) =>
                              prev.filter((f) => f !== file),
                            )
                          }
                          className="grid h-6 w-6 place-items-center rounded-md text-faint hover:bg-white/8 hover:text-cloud"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setFormOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    submitting ||
                    !policyConfirmed ||
                    !reason.trim() ||
                    files.length < 1
                  }
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit request"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Modal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        title="Refund request submitted"
        description="Thanks — we'll review your request and update this order once processed."
        className="max-w-md"
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="max-w-xs text-sm text-mist">
            Status is now{" "}
            <span className="font-medium text-cloud">Refund Requested</span>.
            You can close this and check back later for updates.
          </p>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => setConfirmationOpen(false)}
          >
            Done
          </Button>
        </div>
      </Modal>
    </>
  );
}
