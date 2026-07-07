"use client";

import { MapPin, DollarSign, Eye, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { useIFundAyiti } from "../context/ifundayiti-context";
import { IFundApplicant } from "../data/mock-data";

export function IFundAyitiApplicants() {
  const { applicants, setActiveApplicantProfile } = useIFundAyiti();

  // Filter approved applicants. Include Top 5 Finalists as well since they are approved.
  const approvedApplicants = applicants.filter(
    (app) => app.status === "Approved" || app.status === "Top 5 Finalist"
  );

  return (
    <section className="relative py-24 border-t border-hairline">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <span className="eyebrow font-semibold">Active Pool</span>
            <h2 className="mt-3 text-3xl font-bold font-display text-cloud sm:text-4xl">
              Approved Applicants
            </h2>
            <p className="mt-4 text-mist">
              These applications have been reviewed, document-vetted, and approved by the IFundAyiti board for the current grant period.
            </p>
          </Reveal>
        </div>

        {approvedApplicants.length === 0 ? (
          <Reveal className="text-center py-12 rounded-3xl border border-dashed border-hairline-strong bg-panel/10">
            <p className="text-mist">No approved applicants for the current period yet.</p>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {approvedApplicants.map((app, i) => (
              <Reveal 
                key={app.id} 
                delay={i * 80}
                className="border-gradient group relative flex flex-col justify-between rounded-3xl bg-panel/30 p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-panel/50 hover:glow-violet"
              >
                {/* Upper portion */}
                <div>
                  {/* Photo and Header */}
                  <div className="flex items-center gap-4">
                    <img
                      src={app.photoUrl}
                      alt={app.name}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-violet/10 group-hover:ring-violet/30 transition-all duration-500"
                    />
                    <div>
                      <h3 className="font-display font-semibold text-cloud group-hover:text-violet-bright transition-colors">
                        {app.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-faint mt-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{app.location.split(",")[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Summary */}
                  <div className="mt-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-violet-bright bg-violet/10 border border-violet/20 rounded-full px-2.5 py-0.5 inline-block mb-2">
                      {app.projectName}
                    </span>
                    <p className="text-sm text-mist line-clamp-3 leading-relaxed mt-1">
                      {app.projectDescription}
                    </p>
                  </div>
                </div>

                {/* Lower portion */}
                <div className="mt-6 pt-5 border-t border-hairline flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-faint">Requested Amount</span>
                    <span className="font-display font-bold text-cloud text-lg mt-0.5">
                      {formatPrice(app.requestedAmount)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setActiveApplicantProfile(app)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-bright hover:text-cloud transition-colors duration-300 px-3.5 py-2 rounded-full bg-violet/10 hover:bg-violet-bright/90 border border-violet/20 hover:border-transparent outline-none cursor-pointer"
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
