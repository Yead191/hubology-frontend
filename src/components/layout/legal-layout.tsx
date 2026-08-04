import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

interface LegalLayoutProps {
  title: string;
  effectiveDate?: string;
  /** HTML body from GET /disclaimer. */
  html?: string;
  children?: React.ReactNode;
}

export function LegalLayout({
  title,
  effectiveDate,
  html,
  children,
}: LegalLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-16">
      <Aurora
        animated
        className="-top-20 left-1/2 h-96 w-200 -translate-x-1/2 opacity-25"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Link
            href="/"
            className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-mist transition-colors hover:text-violet-bright"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <header className="mb-8 border-b border-hairline pb-5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-cloud sm:text-3xl">
              {title}
            </h1>
            {effectiveDate && (
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-violet-bright">
                Effective Date: {effectiveDate}
              </p>
            )}
          </header>
        </Reveal>

        <Reveal delay={100}>
          {html ? (
            <div
              className="prose-legal text-sm leading-relaxed text-mist sm:text-[0.9375rem]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : children ? (
            <div className="prose-legal flex flex-col gap-3 text-sm leading-relaxed text-mist sm:text-[0.9375rem]">
              {children}
            </div>
          ) : (
            <p className="text-sm text-mist">
              This document is temporarily unavailable. Please try again later.
            </p>
          )}
        </Reveal>
      </div>
    </main>
  );
}
