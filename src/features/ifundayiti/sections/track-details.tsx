"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Search, Calendar, MapPin, Briefcase,
  Building, DollarSign, FileCheck, CheckCircle2, AlertCircle, Bookmark
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useIFundAyiti } from "../context/ifundayiti-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

export function IFundAyitiTrackDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { applicants } = useIFundAyiti();

  const idParam = searchParams.get("id") || "";
  const dobParam = searchParams.get("dob") || "";

  const [searchId, setSearchId] = useState(idParam);
  const [searchDob, setSearchDob] = useState(dobParam);
  const [app, setApp] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Look up the application when params change or applicants load
  useEffect(() => {
    if (idParam && dobParam && applicants.length > 0) {
      const found = applicants.find(
        (a) =>
          a.id.trim().toLowerCase() === idParam.trim().toLowerCase() &&
          a.dob.trim() === dobParam.trim()
      );
      setApp(found || null);
      setSearched(true);
    } else {
      setApp(null);
      setSearched(false);
    }
  }, [idParam, dobParam, applicants]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!searchId.trim()) {
      setErrorMsg("Please enter your Tracking ID");
      return;
    }
    if (!searchDob.trim()) {
      setErrorMsg("Please select your Date of Birth");
      return;
    }

    router.push(`/ifundayiti/track?id=${searchId.trim()}&dob=${searchDob.trim()}`);
  };

  // Status mapping to progress stages
  const getStatusStage = (status: string) => {
    switch (status) {
      case "Submitted": return 1;
      case "Under Review": return 2;
      case "Approved": return 3;
      case "Top 5 Finalist": return 4;
      case "Winner": return 5;
      case "Rejected":
      case "Archived": return -1;
      default: return 1;
    }
  };

  const steps = [
    { label: "Submitted", step: 1 },
    { label: "Under Review", step: 2 },
    { label: "Approved", step: 3 },
    { label: "Top 5 Finalist", step: 4 },
    { label: "Winner", step: 5 },
  ];

  const currentStage = app ? getStatusStage(app.status) : 0;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Under Review": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Approved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Top 5 Finalist": return "bg-violet/10 text-violet-bright border-violet-bright/30";
      case "Winner": return "bg-amber-400/20 text-amber-300 border-amber-400/30";
      case "Rejected": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Archived": return "bg-faint/10 text-mist border-faint/20";
      default: return "bg-white/5 text-cloud border-hairline";
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 bg-ink overflow-hidden!">
      <Aurora animated className="-top-20 left-1/2 h-130 w-170 -translate-x-1/2 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

        {/* Back navigation */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/ifundayiti")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-mist hover:text-cloud transition-colors duration-200 outline-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Landing Page</span>
          </button>
        </div>

        {/* CASE 1: No lookup params yet or app not found - show search widget */}
        {(!searched || !app) ? (
          <Reveal className="border-gradient rounded-3xl bg-panel/40 p-8 md:p-10 backdrop-blur-md max-w-2xl mx-auto shadow-xl">
            <div className="text-center mb-8">
              <span className="eyebrow">Secure Lookup</span>
              <h2 className="mt-3 text-2xl font-bold font-display text-cloud">
                {searched && !app ? "Application Not Found" : "Track Your Application"}
              </h2>
              <p className="mt-2 text-sm text-mist">
                {searched && !app
                  ? "No record was found matching that tracking ID and birthdate. Try entering details again."
                  : "Input your Tracking ID and Date of Birth to review your full application details."}
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-5">
              <div>
                <Label htmlFor="searchId" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Application Tracking ID
                </Label>
                <Input
                  id="searchId"
                  placeholder="e.g. IFA-2026-000101"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="bg-ink/50 border-hairline text-cloud h-11 placeholder:text-faint focus:ring-violet/40 focus:border-violet"
                />
              </div>

              <div>
                <Label htmlFor="searchDob" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Date of Birth
                </Label>
                <Input
                  id="searchDob"
                  type="date"
                  value={searchDob}
                  onChange={(e) => setSearchDob(e.target.value)}
                  className="bg-ink/50 border-hairline text-cloud h-11 focus:ring-violet/40 focus:border-violet"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-rose-400 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-violet-bright hover:bg-violet-bright/90 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Search className="h-4 w-4" />
                <span>Locate Application</span>
              </Button>
            </form>
          </Reveal>
        ) : (
          /* CASE 2: Application Located - show full read-only information */
          <div className="space-y-8">

            {/* Header Status Card */}
            <Reveal className="border-gradient rounded-3xl bg-panel-soft/60 p-6 md:p-8 backdrop-blur-md shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`border rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusClass(app.status)}`}>
                    {app.status}
                  </span>
                  <span className="text-xs text-faint">ID: {app.id}</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-cloud mt-3">{app.name}</h1>
                <p className="text-xs text-mist mt-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Submitted on: {app.submissionDate}</span>
                </p>
              </div>

              <div className="border border-hairline p-4 rounded-2xl bg-ink/30 min-w-50">
                <span className="block text-[10px] uppercase tracking-wider text-faint">Requested Grant</span>
                <span className="font-display font-extrabold text-2xl text-gradient block mt-1">
                  {formatPrice(app.requestedAmount)}
                </span>
                <span className="text-[10px] text-faint block mt-0.5">Maximum limit $1,000</span>
              </div>
            </Reveal>

            {/* Visual Stepper Status Bar */}
            <Reveal className="border-gradient rounded-3xl bg-panel/30 p-8 backdrop-blur-sm shadow">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cloud mb-6">
                Vetting Progress Tracker
              </h3>

              {currentStage === -1 ? (
                <div className={`flex items-start gap-4 p-5 rounded-2xl border ${app.status === "Rejected"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  : "bg-faint/10 border-faint/20 text-mist"
                  }`}>
                  <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Application Status: {app.status}</h4>
                    <p className="text-xs mt-1 leading-relaxed opacity-95">
                      {app.status === "Rejected"
                        ? "Following careful review by our evaluation committee, your application does not match current program requirements. You are welcome to submit a revised project details in future periods."
                        : "This application has been archived at the conclusion of the cohort period. All winners have been finalized."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative pt-2 pb-6 ">
                  {/* Background Bar */}
                  <div className="absolute top-[30%] left-0 w-full h-1 -translate-y-1/2 bg-white/5 rounded-full" />

                  {/* Active Progress Bar */}
                  <div
                    className="absolute top-[30%] left-0 h-1 -translate-y-1/2 bg-linear-to-r from-violet-bright to-violet-bright/50 rounded-full transition-all duration-700 "
                    style={{ width: `${((currentStage - 1) / (steps.length - 1)) * 100}%` }}
                  />

                  {/* Step Nodes */}
                  <div className="relative z-10 flex justify-between">
                    {steps.map((s) => {
                      const isDone = s.step < currentStage;
                      const isActive = s.step === currentStage;
                      return (
                        <div key={s.step} className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-500 ${isDone
                              ? "bg-violet-bright border-transparent text-white"
                              : isActive
                                ? "bg-ink border-violet-bright text-violet-bright ring-4 ring-violet/10 font-bold"
                                : "bg-ink border-hairline text-faint"
                              }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 stroke-3" />
                            ) : (
                              <span className="text-xs">{s.step}</span>
                            )}
                          </div>
                          <span className={`text-[10px] mt-2 font-medium tracking-wide ${isActive ? "text-violet-bright font-semibold" : isDone ? "text-cloud" : "text-faint"
                            }`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Reveal>

            {/* Full Submitted Details - READ ONLY */}
            <Reveal className="border-gradient rounded-3xl bg-panel/30 p-8 backdrop-blur-sm space-y-8">
              <div>
                <span className=" text-cloud text-xs font-semibold uppercase tracking-wider mb-6 pb-2 border-b border-hairline flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4 text-violet-bright" />
                  Full Application Intake Details
                </span>

                {/* Grid groups */}
                <div className="grid gap-6 sm:grid-cols-2">

                  {/* Left Column: Personal info */}
                  <div className="space-y-4">
                    <h4 className="text-cloud text-xs font-bold uppercase tracking-wider">1. Applicant Profile</h4>
                    <div className="space-y-3 text-sm text-mist bg-ink/10 border border-hairline/60 p-4 rounded-xl">
                      <div>
                        <span className="text-[10px] text-faint block">Full Name</span>
                        <span className="font-semibold text-cloud">{app.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">Date of Birth</span>
                        <span className="font-semibold text-cloud">{app.dob}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">Nationality</span>
                        <span className="font-semibold text-cloud">{app.nationality}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">Address / Location</span>
                        <span className="font-semibold text-cloud flex items-start gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-violet-bright mt-0.5 shrink-0" />
                          <span>{app.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Contact & IDs */}
                  <div className="space-y-4">
                    <h4 className="text-cloud text-xs font-bold uppercase tracking-wider">2. Contact & Identity</h4>
                    <div className="space-y-3 text-sm text-mist bg-ink/10 border border-hairline/60 p-4 rounded-xl">
                      <div>
                        <span className="text-[10px] text-faint block">Email Address</span>
                        <span className="font-semibold text-cloud">{app.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">Phone Number</span>
                        <span className="font-semibold text-cloud">{app.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">National ID (NIF / CIN)</span>
                        <span className="font-mono text-cloud font-semibold">{app.nationalId}</span>
                      </div>
                      {app.passport && (
                        <div>
                          <span className="text-[10px] text-faint block">Passport Number</span>
                          <span className="font-mono text-cloud font-semibold">{app.passport}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Business project: Full Width */}
                  <div className="sm:col-span-2 space-y-4">
                    <h4 className="text-cloud text-xs font-bold uppercase tracking-wider">3. Project Proposal</h4>
                    <div className="space-y-4 text-sm text-mist bg-ink/10 border border-hairline/60 p-5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-faint block">Business/Project Name</span>
                        <span className="font-semibold text-cloud text-base">{app.projectName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">Project Details & Story</span>
                        <p className="mt-1 leading-relaxed text-cloud">{app.story || app.projectDescription}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">Fund Utilization Plan</span>
                        <p className="mt-1 leading-relaxed">{app.fundUsage}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">Expected Impact</span>
                        <p className="mt-1 leading-relaxed">{app.expectedImpact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial & occupation: Full Width */}
                  <div className="sm:col-span-2 space-y-4">
                    <h4 className="text-cloud text-xs font-bold uppercase tracking-wider">4. Financial Context</h4>
                    <div className="space-y-4 text-sm text-mist bg-ink/10 border border-hairline/60 p-5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-faint block">Current Occupation</span>
                        <span className="font-semibold text-cloud flex items-center gap-1">
                          <Briefcase className="h-4 w-4 text-violet-bright" />
                          <span>{app.occupation}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-faint block">Financial Challenge Write-up</span>
                        <p className="mt-1 leading-relaxed">{app.financialBackground}</p>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded files metadata: Full Width */}
                  {app.documents && app.documents.length > 0 && (
                    <div className="sm:col-span-2 space-y-4">
                      <h4 className="text-cloud text-xs font-bold uppercase tracking-wider">5. Compliance Documentation</h4>
                      <div className="grid gap-2 sm:grid-cols-2 bg-ink/10 border border-hairline/60 p-4 rounded-xl">
                        {app.documents.map((doc: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-hairline bg-ink/30 text-xs text-cloud">
                            <span className="font-semibold">{doc.type}</span>
                            <span className="text-faint">{doc.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </Reveal>

          </div>
        )}

      </div>
    </section>
  );
}
