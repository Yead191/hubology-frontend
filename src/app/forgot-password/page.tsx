import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

import { FocusShell } from "@/components/auth/focus-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Hubology password.",
};

export default function ForgotPasswordPage() {
  return (
    <FocusShell
      eyebrow="Reset password"
      icon={<KeyRound className="h-7 w-7" />}
      title="Forgot your password?"
      subtitle="Enter the email tied to your account and we'll send you a one-time code to reset it."
    >
      <ForgotPasswordForm />
    </FocusShell>
  );
}
