import type { Metadata } from "next";
import { Suspense } from "react";
import { MailCheck } from "lucide-react";

import { FocusShell } from "@/components/auth/focus-shell";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Verify your email",
  "Enter the one-time code we sent to your email.",
);

interface PageProps {
  searchParams: Promise<{ email?: string; flow?: string }>;
}

/** Masks an email like j••••@domain.com for privacy in the UI. */
function maskEmail(email?: string) {
  if (!email || !email.includes("@")) return "your email";
  const [name, domain] = email.split("@");
  const shown = name.slice(0, 1);
  return `${shown}${"•".repeat(Math.max(name.length - 1, 3))}@${domain}`;
}

export default async function VerifyOtpPage({ searchParams }: PageProps) {
  const { email, flow } = await searchParams;
  const isReset = flow === "reset";

  return (
    <FocusShell
      eyebrow={isReset ? "Reset password" : "Verify email"}
      icon={<MailCheck className="h-7 w-7" />}
      title="Enter your code"
      subtitle={
        <>
          We sent a one-time code to{" "}
          <span className="font-medium text-cloud">{maskEmail(email)}</span>.
          Enter it below to continue.
        </>
      }
      backHref={isReset ? "/forgot-password" : "/login"}
      backLabel={isReset ? "Use a different email" : "Back to sign in"}
    >
      <Suspense fallback={null}>
        <VerifyOtpForm />
      </Suspense>
    </FocusShell>
  );
}
