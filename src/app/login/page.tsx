import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description:
    "Sign in to your Hubology account to access bookings, membership, the community forum, and your dashboard.",
  path: "/login",
  keywords: ["Hubology login", "sign in", "member login"],
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your experts, sessions, and community."
      panelEyebrow="Hubology"
      panelTitle="Your business brain trust, all in one place."
      panelPoints={[
        "Verified experts across every business need",
        "Private 1-on-1 strategy sessions",
        "A community of founders who get it",
      ]}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
