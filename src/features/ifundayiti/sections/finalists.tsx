"use client";

import { Award, MapPin, Target, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { useIFundAyiti } from "../context/ifundayiti-context";

export function IFundAyitiFinalists() {
  const { applicants, setActiveApplicantProfile, period } = useIFundAyiti();

  // Filter Top 5 Finalists
  const finalists = applicants.filter((app) => app.status === "Top 5 Finalist");

  return (
    <section className="relative py-24 bg-ink-700/10 border-t border-hairline">
      {/* Visual background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-80 w-80 bg-violet/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <span className="eyebrow font-semibold flex items-center justify-center gap-1.5">
              <Award className="h-4 w-4" />
              Finalist Selection
            </span>
            <h2 className="mt-3 text-3xl font-bold font-display text-cloud sm:text-4xl">
              Top 5 Finalists
            </h2>
            <p className="mt-4 text-mist">
              These outstanding entrepreneurs have been selected as the Top 5 finalists for the {period.title}.
            </p>
          </Reveal>
        </div>

        {finalists.length === 0 ? (
          <Reveal className="text-center py-16 rounded-3xl border border-dashed border-hairline bg-panel/20 backdrop-blur-sm max-w-2xl mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mx-auto mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold font-display text-cloud">Vetting in Progress</h3>
            <p className="text-sm text-mist max-w-md mx-auto mt-2 leading-relaxed">
              Top 5 Finalists will be selected and displayed here once the application period closes and evaluations are completed by the review committee.
            </p>
          </Reveal>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
            {finalists.map((app, i) => (
              <Reveal 
                key={app.id} 
                delay={i * 90}
                className="border-gradient group relative flex flex-col justify-between rounded-3xl bg-panel/50 p-7 hover:bg-panel/75 hover:glow-violet transition-all duration-500"
              >
                {/* Glowing Badge for Finalists */}
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-violet-bright px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 shadow-md">
                  <Award className="h-3 w-3" />
                  Finalist
                </span>

                <div>
                  {/* Info Header */}
                  <div className="flex items-center gap-4 mt-2">
                    <img
                      src={app.photoUrl}
                      alt={app.name}
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-violet-bright/20"
                    />
                    <div>
                      <h3 className="font-display text-lg font-bold text-cloud group-hover:text-violet-bright transition-colors">
                        {app.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-faint mt-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{app.location.split(",")[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-cloud uppercase tracking-wide">
                      Project: {app.projectName}
                    </h4>
                    <p className="text-sm text-mist leading-relaxed mt-2 line-clamp-4">
                      {app.story || app.projectDescription}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-8 pt-5 border-t border-hairline flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-faint">Requested Grant</span>
                    <span className="font-display font-extrabold text-cloud text-xl mt-0.5">
                      {formatPrice(app.requestedAmount)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setActiveApplicantProfile(app)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cloud hover:text-white transition-all duration-300 px-4 py-2.5 rounded-full bg-violet-bright hover:bg-violet-bright/95 shadow-lg shadow-violet/20 hover:shadow-violet/40 border border-white/10 outline-none cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
