import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-36">
      {/* Ambient signature glow */}
      <Aurora
        animated
        className="-top-20 left-1/2 h-[34rem] w-[44rem] -translate-x-1/2 opacity-60"
      />
      <Aurora className="right-0 top-40 hidden h-72 w-72 opacity-30 md:block" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Banner image — no text on top, per brief */}
        <Reveal>
          <div className="border-gradient relative aspect-[16/7] w-full overflow-hidden rounded-[1.75rem] glow-soft">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
              alt="Entrepreneurs collaborating in a modern workspace"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          </div>
        </Reveal>

        {/* Copy block below the image */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center text-center">
          <Reveal delay={80}>
            <Badge>
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by founders worldwide
            </Badge>
          </Reveal>

          <Reveal delay={140}>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-cloud sm:text-5xl md:text-[3.5rem]">
              The all-in-one digital workspace to{" "}
              <span className="text-gradient">launch, grow, and scale</span> your
              business.
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-mist">
              Access tools, resources, and a community of entrepreneurs in one
              place.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/join">
                  Join Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">Explore services</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
