import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Aurora } from "@/components/ui/aurora";

interface FocusShellProps {
  /** Small pill/eyebrow above the icon. */
  eyebrow?: string;
  /** Icon rendered in the glowing badge. */
  icon: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
  /** Optional footer (links, help text). */
  footer?: React.ReactNode;
  /** Back link target + label. */
  backHref?: string;
  backLabel?: string;
}

/**
 * Centered, single-column premium shell used by the focused auth steps
 * (verify OTP, forgot password, reset password).
 */
export function FocusShell({
  eyebrow,
  icon,
  title,
  subtitle,
  children,
  footer,
  backHref = "/login",
  backLabel = "Back to sign in",
}: FocusShellProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      <Aurora
        animated
        className="-top-16 left-1/2 h-128 w-152 -translate-x-1/2 opacity-45"
      />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>

        <div className="border-gradient relative rounded-[2rem] bg-panel/50 p-8 glow-soft sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="relative mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_16px_44px_-12px_rgba(129,49,240,0.9)]">
              {icon}
            </span>
            {eyebrow ? <span className="eyebrow mb-2">{eyebrow}</span> : null}
            <h1 className="text-2xl font-bold text-cloud sm:text-3xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-mist">{subtitle}</p>
          </div>

          <div className="mt-8">{children}</div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          {footer}
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-cloud"
          >
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
