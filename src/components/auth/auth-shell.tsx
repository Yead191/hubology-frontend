import Link from "next/link";
import { Check } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Aurora } from "@/components/ui/aurora";

interface AuthShellProps {
  /** Headline + copy for the form column. */
  title: string;
  subtitle: string;
  /** The form column content. */
  children: React.ReactNode;
  /** Brand panel content. */
  panelEyebrow: string;
  panelTitle: string;
  panelPoints: string[];
}

export function AuthShell({
  title,
  subtitle,
  children,
  panelEyebrow,
  panelTitle,
  panelPoints,
}: AuthShellProps) {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <Aurora className="-top-24 left-1/3 h-[34rem] w-[40rem] opacity-40" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        {/* Brand panel */}
        <aside className="border-gradient relative hidden overflow-hidden rounded-[2rem] bg-panel/40 p-10 lg:flex lg:flex-col lg:justify-between">
          <Aurora className="-bottom-20 -left-10 h-72 w-72 opacity-50" />
          <div className="relative">
            <span className="eyebrow">{panelEyebrow}</span>
            <h2 className="mt-5 text-balance text-3xl font-bold leading-tight text-cloud">
              {panelTitle}
            </h2>
          </div>
          <ul className="relative mt-10 flex flex-col gap-4">
            {panelPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-cloud/85">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gradient text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <p className="relative mt-10 text-sm text-mist">
            “Hubology is where I find people who have already solved the problem
            in front of me.”
          </p>
        </aside>

        {/* Form column */}
        <div className="border-gradient relative flex flex-col justify-center rounded-[2rem] bg-panel/50 p-8 glow-soft sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="lg:hidden">
              <Logo />
            </Link>
            <div className="mt-6 flex flex-col gap-2 lg:mt-0">
              <h1 className="text-3xl font-bold text-cloud">{title}</h1>
              <p className="text-sm text-mist">{subtitle}</p>
            </div>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
