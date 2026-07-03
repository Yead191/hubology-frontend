import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

interface LegalLayoutProps {
  title: string;
  effectiveDate?: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, effectiveDate, children }: LegalLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden pt-32 pb-24">
      {/* Background Ambience */}
      <Aurora
        animated
        className="-top-20 left-1/2 h-[500px] w-[800px] -translate-x-1/2 opacity-30"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8 z-10">
        <Reveal>
          <Link
            href="/"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-mist transition-colors hover:text-violet-bright"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <header className="mb-12 border-b border-hairline pb-8">
            <h1 className="font-display text-4xl font-bold tracking-tight text-cloud sm:text-5xl">
              {title}
            </h1>
            {effectiveDate && (
              <p className="mt-4 text-sm font-medium text-violet-bright uppercase tracking-wider">
                Effective Date: {effectiveDate}
              </p>
            )}
          </header>
        </Reveal>

        <Reveal delay={100}>
          <div className="prose-legal flex flex-col gap-6 text-mist text-base md:text-lg leading-relaxed">
            {children}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
