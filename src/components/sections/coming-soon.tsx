import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

interface ComingSoonProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
}

export function ComingSoon({
  icon: Icon,
  eyebrow,
  title,
  description,
  bullets,
}: ComingSoonProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-20">
      <Aurora
        animated
        className="left-1/2 top-1/3 h-[32rem] w-[42rem] -translate-x-1/2 opacity-45"
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal className="flex flex-col items-center">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <Icon className="h-8 w-8" />
          </span>
          <div className="mt-6">
            <Badge variant="outline">{eyebrow}</Badge>
          </div>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.1] text-cloud sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-mist">
            {description}
          </p>
        </Reveal>

        {bullets && bullets.length > 0 && (
          <Reveal
            delay={120}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 text-left"
          >
            {bullets.map((b) => (
              <div
                key={b}
                className="border-gradient rounded-2xl bg-panel/40 px-5 py-4 text-sm text-cloud/85"
              >
                {b}
              </div>
            ))}
          </Reveal>
        )}

        <Reveal delay={180} className="mt-10 flex justify-center gap-3">
          <Button asChild>
            <Link href="/join">Join the Hub</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
