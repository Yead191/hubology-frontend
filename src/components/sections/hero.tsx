"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, Pause } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <section className="relative overflow-hidden pt-32 md:pt-36">
      {/* Ambient signature glow */}
      <Aurora
        animated
        className="-top-20 left-1/2 h-136 w-176 -translate-x-1/2 opacity-60"
      />
      <Aurora className="right-0 top-40 hidden h-72 w-72 opacity-30 md:block" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Banner image — no text on top, per brief */}
        <Reveal>
          <div className="group border-gradient relative aspect-16/7 w-full overflow-hidden rounded-[1.75rem] glow-soft">
            <video
              ref={videoRef}
              src="https://res.cloudinary.com/dknmebeee/video/upload/v1782970981/Video_Project_vddrk9.mp4"
              // src="https://res.cloudinary.com/dknmebeee/video/upload/v1782974542/Generated_Video_July_02_2026_-_10_51AM_xl693o.mp4"
              className="h-full w-full object-cover"
              playsInline
              onEnded={handleEnded}
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />

            <div
              className={`absolute inset-0 flex cursor-pointer items-center justify-center transition-all duration-500 ${isPlaying ? "opacity-0 group-hover:opacity-100 bg-black/20" : "opacity-100 bg-black/30 backdrop-blur-sm"}`}
              onClick={togglePlay}
            >
              <button
                className="group/btn flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 transition-transform group-hover/btn:scale-110" fill="currentColor" />
                ) : (
                  <Play className="ml-1 h-8 w-8 transition-transform group-hover/btn:scale-110" fill="currentColor" />
                )}
              </button>
            </div>
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
