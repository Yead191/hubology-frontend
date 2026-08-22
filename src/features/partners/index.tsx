"use client";

import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";

import { Aurora } from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
export default function PartnersExperience({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen overflow-x-clip pb-20 pt-32">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-35"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <header className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">
                Partner network
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
                Our <span className="text-gradient">partners</span>
              </h1>
              <p className="mt-2 text-sm text-mist sm:text-base">
                Browse the ecosystem — open a partner to see offers, contact, and
                full details.
              </p>
            </header>

            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link href="/partners/apply">
                <Handshake className="h-4 w-4" />
                Become a partner
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        {children}
      </div>
    </section>
  );
}
