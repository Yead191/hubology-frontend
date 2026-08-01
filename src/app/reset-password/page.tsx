import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { FocusShell } from "@/components/auth/focus-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Reset password",
  "Choose a new password for your Hubology account.",
);

export default function ResetPasswordPage() {
  return (
    <FocusShell
      eyebrow="Almost done"
      icon={<ShieldCheck className="h-7 w-7" />}
      title="Set a new password"
      subtitle="Choose a strong password you don't use anywhere else. You'll use it to sign in from now on."
    >
      <ResetPasswordForm />
    </FocusShell>
  );
}
