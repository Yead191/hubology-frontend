"use client";

import * as React from "react";
import {
  Ban,
  ShieldAlert,
  EyeOff,
  Compass,
  MoreHorizontal,
  CheckCircle2,
  Loader2,
  AlertTriangle
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ForumPost } from "@/types";
import { reportForumPost } from "@/helpers/next-fetch/forumActions";
import { toast } from "sonner";

interface ReportReason {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const REPORT_REASONS: ReportReason[] = [
  {
    id: "spam",
    label: "Spam or self-promotion",
    description: "Irrelevant ads, affiliate links, or repeated promotional messages.",
    icon: Ban,
  },
  {
    id: "harassment",
    label: "Harassment or hate speech",
    description: "Personal attacks, offensive remarks, or hostile behavior.",
    icon: ShieldAlert,
  },
  {
    id: "inappropriate",
    label: "Inappropriate content",
    description: "Graphic content, explicit language, or sensitive media.",
    icon: EyeOff,
  },
  {
    id: "off-topic",
    label: "Off-topic or low quality",
    description: "Content that doesn't fit the community guidelines or professional focus.",
    icon: Compass,
  },
  {
    id: "other",
    label: "Other reason",
    description: "A reason not listed above. Please provide more context.",
    icon: MoreHorizontal,
  },
];

const MAX_DETAILS = 500;

export function ReportModal({
  open,
  onClose,
  post,
}: {
  open: boolean;
  onClose: () => void;
  post: ForumPost;
}) {
  const [selectedReason, setSelectedReason] = React.useState<string | null>(null);
  const [details, setDetails] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle");

  // Reset form states when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setSelectedReason(null);
      setDetails("");
      setStatus("idle");
    }
  }, [open]);

  const isOther = selectedReason === "other";
  const canSubmit =
    selectedReason !== null && (!isOther || details.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    setStatus("loading");
    try {
      const description = isOther
        ? details.trim()
        : (REPORT_REASONS.find((r) => r.id === selectedReason)?.label ??
          selectedReason);

      const res = await reportForumPost({
        post: post.id,
        reason: selectedReason,
        description,
      });

      if (!res.success) {
        toast.error(res.message || "Could not submit report.", {
          id: "report",
        });
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      toast.error("Network error. Please try again.", { id: "report" });
      setStatus("idle");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        status === "success" ? null : (
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report this post
          </span>
        )
      }
      description={
        status === "success"
          ? null
          : "Help us keep our community professional, safe, and supportive."
      }
      className="max-w-lg"
    >
      {status === "success" ? (
        <div className="flex flex-col items-center py-6 text-center">
          {/* Success Checkmark with ambient purple glow */}
          <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 ring-2 ring-violet-bright/35">
            <div className="absolute inset-0 rounded-full bg-violet-bright/20 blur-md" />
            <CheckCircle2 className="relative h-10 w-10 text-violet-bright" />
          </div>

          <h3 className="font-display text-xl font-semibold tracking-tight text-cloud">
            Thank you for your report
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">
            Our moderation team will review this post against our community guidelines shortly. Your reports keep Hubology safe and professional.
          </p>

          <Button onClick={handleClose} className="mt-8 min-w-32">
            Close window
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-faint">
              Please select a reason
            </span>
            <div className="flex flex-col gap-2.5">
              {REPORT_REASONS.map((reason) => {
                const Icon = reason.icon;
                const isSelected = selectedReason === reason.id;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setSelectedReason(reason.id)}
                    className={cn(
                      "flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/25",
                      isSelected
                        ? "border-violet/50 bg-violet/8 shadow-[0_4px_20px_-4px_rgba(129,49,240,0.15)]"
                        : "border-hairline bg-white/1 hover:border-hairline-strong hover:bg-white/3"
                    )}
                  >
                    {/* Reason Icon container */}
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        isSelected
                          ? "border-violet/30 bg-violet/10 text-violet-bright"
                          : "border-hairline bg-white/2 text-faint"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <p className={cn("text-sm font-semibold transition-colors", isSelected ? "text-cloud" : "text-mist")}>
                        {reason.label}
                      </p>
                      <p className="mt-1 text-xs leading-normal text-faint">
                        {reason.description}
                      </p>
                    </div>

                    {/* Custom Radio Button */}
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 border-hairline-strong bg-white/2">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full bg-violet-bright scale-0 transition-transform duration-300",
                          isSelected && "scale-100"
                        )}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Textarea for details */}
          {isOther && (
            <div className="flex flex-col gap-2 animation-fade-in">
              <label htmlFor="report-details" className="text-sm font-medium text-cloud">
                Describe the issue <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="report-details"
                value={details}
                maxLength={MAX_DETAILS}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="What guideline does this post break? Please provide specific details..."
                className="min-h-24"
                required
              />
              <span className="self-end text-xs text-faint tabular-nums">
                {details.length}/{MAX_DETAILS}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-2 flex justify-end gap-3 border-t border-hairline pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={status === "loading"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || status === "loading"}
              className="min-w-32"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit report"
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
