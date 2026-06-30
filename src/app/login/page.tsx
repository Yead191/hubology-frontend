import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Hubology account.",
};

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
      <LoginForm />
    </AuthShell>
  );
}
