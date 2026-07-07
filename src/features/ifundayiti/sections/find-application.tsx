"use client";

import React, { useState } from "react";
import { Search, Calendar, FileText, CheckCircle2, AlertCircle, X, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useIFundAyiti } from "../context/ifundayiti-context";

export function IFundAyitiFindApplication() {
  const { searchResult, searchApplication, clearSearch } = useIFundAyiti();
  const [trackingId, setTrackingId] = useState("");
  const [dob, setDob] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!trackingId.trim()) {
      setErrorMsg("Please enter a Tracking ID");
      return;
    }
    if (!dob.trim()) {
      setErrorMsg("Please enter your Date of Birth");
      return;
    }

    searchApplication(trackingId.trim(), dob.trim());
  };

  // Determine stage mapping for visual tracking bar
  const getStatusStage = (status: string) => {
    switch (status) {
      case "Submitted":
        return 1;
      case "Under Review":
        return 2;
      case "Approved":
        return 3;
      case "Top 5 Finalist":
        return 4;
      case "Winner":
        return 5;
      case "Rejected":
      case "Archived":
        return -1; // Special/terminal
      default:
        return 1;
    }
  };

  const steps = [
    { label: "Submitted", step: 1 },
    { label: "Under Review", step: 2 },
    { label: "Approved", step: 3 },
    { label: "Top 5 Finalist", step: 4 },
    { label: "Winner", step: 5 },
  ];

  const currentStage = searchResult ? getStatusStage(searchResult.status) : 0;

  return (
    <section id="find-application" className="relative py-20 bg-ink-700/30 border-t border-hairline scroll-mt-24">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <Reveal>
            <span className="eyebrow">Status Center</span>
            <h2 className="mt-3 text-2xl font-bold font-display text-cloud sm:text-3xl">
              Track My Application
            </h2>
            <p className="mt-3 text-sm text-mist">
              Check the status of your micro-grant submission securely without creating an account.
            </p>
          </Reveal>
        </div>

        <Reveal className="border-gradient rounded-3xl bg-panel/30 p-8 backdrop-blur-md">
          {searchResult === undefined ? (
            /* Search form */
            <form onSubmit={handleSearch} className="grid gap-6 sm:grid-cols-12 items-end">
              <div className="sm:col-span-5">
                <Label htmlFor="trackingId" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Application Tracking ID
                </Label>
                <Input
                  id="trackingId"
                  placeholder="e.g. IFA-2026-000101"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="bg-ink/50 border-hairline text-cloud h-11 placeholder:text-faint focus:ring-violet/40 focus:border-violet"
                />
              </div>

              <div className="sm:col-span-5">
                <Label htmlFor="dob" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Date of Birth
                </Label>
                <div className="relative">
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-ink/50 border-hairline text-cloud h-11 focus:ring-violet/40 focus:border-violet block w-full pr-10"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-violet-bright hover:bg-violet-bright/90 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
              </div>

              {errorMsg && (
                <div className="col-span-full flex items-center gap-2 text-xs text-rose-400 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          ) : searchResult === null ? (
            /* Not Found view */
            <div className="text-center py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 mx-auto mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-cloud">No Application Found</h3>
              <p className="text-sm text-mist max-w-md mx-auto mt-2 leading-relaxed">
                We couldn't locate an application matching tracking ID <strong className="text-cloud font-medium">"{trackingId}"</strong> and the birthdate provided. Please double-check your receipt details and try again.
              </p>
              <Button
                variant="outline"
                onClick={clearSearch}
                className="mt-6 border-hairline text-cloud hover:bg-white/5 cursor-pointer"
              >
                Go Back
              </Button>
            </div>
          ) : (
            /* Results View */
            <div className="relative">
              
              {/* Header result info */}
              <div className="flex items-start justify-between border-b border-hairline pb-6 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-bright bg-violet/10 border border-violet/20 rounded-full px-3 py-1">
                    Application Located
                  </span>
                  <h3 className="font-display text-xl font-bold text-cloud mt-3">{searchResult.name}</h3>
                  <p className="text-xs text-mist mt-0.5">Submitted on: {searchResult.submissionDate}</p>
                </div>
                
                <button
                  onClick={clearSearch}
                  aria-label="Close search details"
                  className="p-2 rounded-full border border-hairline bg-white/3 text-mist hover:text-cloud hover:bg-white/8 outline-none cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Data Summary Grid */}
              <div className="grid gap-4 sm:grid-cols-3 mb-8 bg-ink/30 border border-hairline p-5 rounded-2xl">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-faint">Tracking ID</span>
                  <span className="font-mono text-sm font-semibold text-cloud mt-0.5 block">{searchResult.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-faint">Project Name</span>
                  <span className="text-sm font-semibold text-cloud mt-0.5 block truncate">{searchResult.projectName}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-faint">Requested Grant</span>
                  <span className="text-sm font-semibold text-cloud mt-0.5 block">{formatPrice(searchResult.requestedAmount)}</span>
                </div>
              </div>

              {/* Stepper Status Indicators */}
              {currentStage === -1 ? (
                /* Rejected or Archived */
                <div className={`flex items-start gap-4 p-5 rounded-2xl border ${
                  searchResult.status === "Rejected" 
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-300" 
                    : "bg-faint/10 border-faint/20 text-mist"
                }`}>
                  <AlertCircle className="h-6 w-6 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Application Status: {searchResult.status}</h4>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">
                      {searchResult.status === "Rejected"
                        ? "Following review by our committee, your application does not match current program criteria. You may apply again in future periods."
                        : "This application has been archived at the completion of the cohort period. All finalists and winners have been recorded."}
                    </p>
                  </div>
                </div>
              ) : (
                /* Stepper progress bar */
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-cloud mb-4">
                    Processing Stage: <span className="text-violet-bright">{searchResult.status}</span>
                  </span>
                  
                  {/* Stepper bar visual */}
                  <div className="relative">
                    {/* Background Bar */}
                    <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-white/5 rounded-full" />
                    
                    {/* Active Progress Bar */}
                    <div 
                      className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-violet-bright to-violet-bright/50 rounded-full transition-all duration-700 ease-out-soft"
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
                              className={`h-7 w-7 rounded-full flex items-center justify-center border transition-all duration-500 ${
                                isDone 
                                  ? "bg-violet-bright border-transparent text-white"
                                  : isActive 
                                    ? "bg-ink border-violet-bright text-violet-bright ring-4 ring-violet/10 font-bold" 
                                    : "bg-ink border-hairline text-faint"
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                              ) : (
                                <span className="text-[10px]">{s.step}</span>
                              )}
                            </div>
                            <span className={`text-[10px] mt-2 font-medium tracking-wide ${
                              isActive ? "text-violet-bright font-semibold" : isDone ? "text-cloud" : "text-faint"
                            }`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </Reveal>

      </div>
    </section>
  );
}
