"use client";

import { Trophy, Calendar, Sparkles, Quote, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { useIFundAyiti } from "../context/ifundayiti-context";

export function IFundAyitiWinners() {
  const { winners } = useIFundAyiti();

  if (winners.length === 0) return null;

  const latestWinner = winners[0];
  const previousWinners = winners.slice(1);

  return (
    <section className="relative py-24 border-t border-hairline">
      {/* Decorative glows */}
      <div className="absolute right-0 bottom-0 h-96 w-96 bg-violet/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <span className="eyebrow font-semibold flex items-center justify-center gap-1.5">
              <Trophy className="h-4 w-4" />
              Success Stories
            </span>
            <h2 className="mt-3 text-3xl font-bold font-display text-cloud sm:text-4xl">
              Grant Winners Spotlight
            </h2>
            <p className="mt-4 text-mist">
              Celebrating the visionaries who received the IFundAyiti $1,000 grant and used it to transform their communities.
            </p>
          </Reveal>
        </div>

        {/* Latest Winner Hero Section */}
        {latestWinner && (
          <Reveal className="border-gradient rounded-3xl bg-panel/40 p-8 md:p-12 mb-16 shadow-[0_20px_50px_-20px_rgba(129,49,240,0.15)] relative overflow-hidden">
            {/* Spotlight overlay */}
            <div className="absolute top-0 right-0 h-48 w-48 bg-linear-to-bl from-violet/20 to-transparent pointer-events-none rounded-tr-3xl" />

            <div className="grid gap-8 md:grid-cols-12 items-center relative z-10">
              {/* Photo spotlight */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-3xl bg-violet-bright/35 blur-xl group-hover:scale-105 transition-transform duration-500 opacity-60" />
                  <img
                    src={latestWinner.photoUrl}
                    alt={latestWinner.name}
                    className="h-64 w-64 rounded-3xl object-cover ring-4 ring-violet-bright/25 relative z-10"
                  />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-ink z-20 shadow-md">
                    <Trophy className="h-3.5 w-3.5 fill-ink/10" />
                    Latest Winner
                  </span>
                </div>
              </div>

              {/* Text spotlight */}
              <div className="md:col-span-8 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-violet-bright font-semibold uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {latestWinner.period}
                  </span>
                  <span className="text-faint">•</span>
                  <span>Awarded {formatPrice(latestWinner.awardedAmount)}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold font-display text-cloud mt-3">
                  {latestWinner.name}
                </h3>
                <p className="text-sm font-semibold text-cloud/90 mt-1 uppercase tracking-wide">
                  Project: {latestWinner.projectName}
                </p>

                <div className="relative mt-6">
                  <Quote className="absolute -top-3 -left-3 h-8 w-8 text-violet/10 pointer-events-none" />
                  <p className="text-sm md:text-base text-mist italic leading-relaxed pl-6 relative z-10">
                    "{latestWinner.successStory}"
                  </p>
                </div>

                {latestWinner.additionalPhotos && latestWinner.additionalPhotos.length > 0 && (
                  <div className="mt-8">
                    <span className="block text-xs uppercase tracking-wider text-faint mb-3">Project Gallery</span>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {latestWinner.additionalPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt="Project detail"
                          className="h-20 w-28 object-cover rounded-xl border border-hairline hover:border-violet/40 transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* Older Winners Grid */}
        {previousWinners.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold font-display text-cloud mb-8">Previous Cohort Winners</h4>
            <div className="grid gap-6 md:grid-cols-2">
              {previousWinners.map((winner, i) => (
                <Reveal
                  key={winner.id}
                  delay={i * 80}
                  className="border-gradient rounded-3xl bg-panel/20 p-6 flex flex-col justify-between hover:bg-panel/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={winner.photoUrl}
                      alt={winner.name}
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-hairline"
                    />
                    <div>
                      <span className="text-[10px] font-semibold text-violet-bright uppercase tracking-wider block">
                        {winner.period} · Funded {formatPrice(winner.awardedAmount)}
                      </span>
                      <h5 className="font-display font-bold text-cloud text-base mt-1">{winner.name}</h5>
                      <span className="text-xs font-semibold text-cloud/85 block mt-0.5">{winner.projectName}</span>
                    </div>
                  </div>

                  <p className="text-xs text-mist leading-relaxed mt-4 italic line-clamp-3">
                    "{winner.successStory}"
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
