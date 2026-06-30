import Image from "next/image";
import { Quote } from "lucide-react";

import { getTestimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/ui/aurora";

export function Testimonials() {
  const testimonials = getTestimonials();

  return (
    <section className="relative overflow-hidden pt-32">
      <Aurora className="left-1/2 top-10 h-72 w-[40rem] -translate-x-1/2 opacity-25" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our members say"
          subtitle="Founders and operators who found the right expert at the right moment."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.id}
              delay={(i % 2) * 100}
              className="border-gradient group relative flex flex-col gap-6 rounded-3xl bg-panel/40 p-8 transition-colors duration-500 hover:bg-panel/70"
            >
              <Quote className="h-8 w-8 text-violet/40" />
              <p className="text-pretty text-base leading-relaxed text-cloud/90">
                {t.quote}
              </p>
              <div className="mt-auto flex items-center gap-4 border-t border-hairline pt-6">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-violet/25">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-cloud">
                    {t.name}
                  </span>
                  <span className="text-xs text-mist">
                    {t.role}, {t.company}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
