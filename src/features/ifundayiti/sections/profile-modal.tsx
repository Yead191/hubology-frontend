"use client";

import { X, MapPin, DollarSign, Building, Briefcase } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useIFundAyiti } from "../context/ifundayiti-context";

export function IFundAyitiProfileModal() {
  const { activeApplicantProfile, setActiveApplicantProfile } = useIFundAyiti();

  if (!activeApplicantProfile) return null;

  const app = activeApplicantProfile;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Under Review":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Top 5 Finalist":
        return "bg-violet-bright bg-violet/10 text-violet-bright border-violet-bright/35";
      case "Winner":
        return "bg-amber-400/20 text-amber-300 border-amber-400/30";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Archived":
        return "bg-faint/10 text-mist border-faint/20";
      default:
        return "bg-white/5 text-cloud border-hairline";
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-panel-soft border border-hairline-strong rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8">
        
        {/* Header banner */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4 bg-panel">
          <span className="font-display font-bold text-cloud text-lg">Applicant Profile</span>
          <button
            onClick={() => setActiveApplicantProfile(null)}
            className="p-1.5 rounded-full border border-hairline bg-white/3 text-mist hover:text-cloud hover:bg-white/8 outline-none cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[75vh] space-y-6">
          
          {/* Main Applicant Info Block */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-hairline">
            <img
              src={app.photoUrl}
              alt={app.name}
              className="h-28 w-28 rounded-2xl object-cover ring-4 ring-violet/15"
            />
            <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 inline-block ${getStatusBadgeClass(app.status)}`}>
                  {app.status}
                </span>
                <span className="text-[10px] font-medium text-faint">Submitted: {app.submissionDate}</span>
              </div>
              
              <h3 className="font-display text-2xl font-bold text-cloud">{app.name}</h3>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-mist">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-violet-bright" />
                  {app.location}
                </span>
                <span className="hidden sm:inline text-faint">|</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-violet-bright" />
                  {app.occupation}
                </span>
              </div>
            </div>
          </div>

          {/* Requested Details block */}
          <div className="grid gap-4 sm:grid-cols-2 bg-ink/30 border border-hairline p-5 rounded-2xl">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-faint flex items-center gap-1 mb-1">
                <Building className="h-3.5 w-3.5" /> Project Name
              </span>
              <span className="font-display font-bold text-cloud text-base">{app.projectName}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-faint flex items-center gap-1 mb-1">
                <DollarSign className="h-3.5 w-3.5" /> Requested Grant Amount
              </span>
              <span className="font-display font-extrabold text-cloud text-lg text-gradient">{formatPrice(app.requestedAmount)}</span>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="space-y-5 text-sm text-mist leading-relaxed">
            
            {/* Story */}
            <div>
              <h4 className="text-cloud font-semibold uppercase tracking-wider text-xs mb-2">Our Story / Context</h4>
              <p className="bg-ink/10 p-4 rounded-xl border border-hairline/40 italic">
                "{app.story || app.projectDescription}"
              </p>
            </div>

            {/* Fund Usage */}
            <div>
              <h4 className="text-cloud font-semibold uppercase tracking-wider text-xs mb-1.5">How the grant will be utilized</h4>
              <p>{app.fundUsage}</p>
            </div>

            {/* Expected Impact */}
            <div>
              <h4 className="text-cloud font-semibold uppercase tracking-wider text-xs mb-1.5">Expected Community Impact</h4>
              <p>{app.expectedImpact}</p>
            </div>

            {/* Financial background */}
            <div>
              <h4 className="text-cloud font-semibold uppercase tracking-wider text-xs mb-1.5">Financial Background & Challenges</h4>
              <p>{app.financialBackground}</p>
            </div>


          </div>

        </div>

        {/* Footer close button */}
        <div className="border-t border-hairline px-6 py-4 bg-panel flex justify-end">
          <button
            onClick={() => setActiveApplicantProfile(null)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-cloud bg-white/3 border border-hairline hover:bg-white/8 outline-none transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
