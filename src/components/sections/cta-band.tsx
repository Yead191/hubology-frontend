import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-32">
      <Reveal className="border-gradient relative overflow-hidden rounded-[2rem] bg-panel/50 px-8 py-16 text-center glow-soft sm:px-16">
        <Aurora className="left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 opacity-50" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-balance text-3xl font-bold leading-tight text-cloud sm:text-4xl">
            Ready to build with the right people beside you?
          </h2>
          <p className="mt-4 max-w-lg text-base text-mist">
            Join Hubology and get matched with verified experts, growth
            resources, and a community of founders today.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/join">
                Join Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services">Browse experts</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
