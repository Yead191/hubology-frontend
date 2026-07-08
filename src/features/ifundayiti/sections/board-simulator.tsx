"use client";

import React, { useState } from "react";
import { Settings, RefreshCw, FileCheck } from "lucide-react";
import { useIFundAyiti } from "../context/ifundayiti-context";
import { formatPrice } from "@/lib/utils";

export function IFundAyitiBoardSimulator() {
  const { 
    period, 
    applicants, 
    simApproveApplicant, 
    simRejectApplicant, 
    simSelectFinalist, 
    simDeclareWinner, 
    simUpdatePeriodStatus, 
    simResetData 
  } = useIFundAyiti();

  const [simOpen, setSimOpen] = useState(false);

  // Group applications for simulation views
  const submittedApps = applicants.filter(app => app.status === "Submitted");
  const approvedApps = applicants.filter(app => app.status === "Approved");
  const finalistApps = applicants.filter(app => app.status === "Top 5 Finalist");

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-90 max-w-full sm:max-w-md print:hidden">
      <div className={`border-gradient rounded-3xl bg-panel-soft/95 backdrop-blur-md shadow-2xl transition-all duration-300 border-hairline-strong ${
        simOpen ? "p-6 max-h-[70vh] w-full sm:w-96 overflow-y-auto" : "p-3 w-fit ml-auto sm:ml-0 h-auto"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setSimOpen(!simOpen)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-bright hover:text-cloud transition-colors outline-none cursor-pointer"
          >
            <Settings className={`h-4 w-4 ${simOpen ? "animate-spin" : ""}`} />
            <span>IFundAyiti Board Simulator</span>
          </button>
          {simOpen && (
            <button 
              onClick={simResetData}
              title="Reset simulation data to default"
              className="text-faint hover:text-rose-400 transition-colors p-1 flex items-center gap-1 text-[10px] uppercase font-bold outline-none cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {simOpen && (
          <div className="mt-5 space-y-5 text-xs text-mist">
            
            {/* Period config */}
            <div className="border border-hairline p-3 rounded-xl bg-ink/20">
              <span className="block text-cloud font-semibold mb-2">1. Cohort Period Control</span>
              <div className="flex items-center justify-between gap-4">
                <span>Status: <strong className="text-cloud">{period.status}</strong></span>
                <div className="flex gap-2">
                  <button
                    onClick={() => simUpdatePeriodStatus("Open")}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      period.status === "Open" ? "bg-emerald-500 text-white" : "bg-white/5 text-mist hover:text-cloud"
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => simUpdatePeriodStatus("Closed")}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      period.status === "Closed" ? "bg-amber-500 text-white" : "bg-white/5 text-mist hover:text-cloud"
                    }`}
                  >
                    Closed
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Approve newly submitted applications */}
            <div className="border border-hairline p-3 rounded-xl bg-ink/20">
              <span className="block text-cloud font-semibold mb-2">2. Pending Applications ({submittedApps.length})</span>
              {submittedApps.length === 0 ? (
                <p className="text-[10px] text-faint">
                  No pending submissions. Click "Apply for a Grant" at the top to submit a new one!
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {submittedApps.map(app => (
                    <div key={app.id} className="flex flex-col gap-2 p-2 bg-ink/40 rounded border border-hairline/50">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate">
                          <span className="font-bold text-cloud block truncate">{app.name}</span>
                          <span className="text-[9px] text-faint">{app.projectName} · {formatPrice(app.requestedAmount)}</span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => simApproveApplicant(app.id)}
                            className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1 py-0.5 rounded text-[8px] font-bold hover:bg-emerald-500 hover:text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => simRejectApplicant(app.id)}
                            className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 py-0.5 rounded text-[8px] font-bold hover:bg-rose-500 hover:text-white"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                      
                      {/* Compliance documents (Vetted files visible to admin only) */}
                      {app.documents && app.documents.length > 0 && (
                        <div className="pt-1.5 border-t border-hairline/25">
                          <span className="text-[8px] text-faint uppercase font-semibold block flex items-center gap-0.5 mb-1">
                            <FileCheck className="h-3 w-3 text-violet-bright" />
                            Compliance Uploads (Vetting Scan):
                          </span>
                          <div className="space-y-0.5">
                            {app.documents.map((doc, idx) => (
                              <div key={idx} className="text-[8px] bg-ink/65 px-1.5 py-0.5 rounded text-cloud flex justify-between border border-hairline/20">
                                <span className="font-medium text-mist">{doc.type}:</span>
                                <span className="text-cloud/90 underline truncate max-w-[120px]">{doc.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Select Finalists */}
            <div className="border border-hairline p-3 rounded-xl bg-ink/20">
              <span className="block text-cloud font-semibold mb-2">3. Vetted Candidates (Approved: {approvedApps.length})</span>
              <p className="text-[9px] text-faint mb-2">Move approved candidates to the Top 5 Finalist list.</p>
              {approvedApps.length === 0 ? (
                <p className="text-[10px] text-faint">No approved candidates. Approve pending ones first.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {approvedApps.map(app => (
                    <div key={app.id} className="flex flex-col gap-2 p-2 bg-ink/40 rounded border border-hairline/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-cloud truncate">{app.name}</span>
                        <button
                          onClick={() => simSelectFinalist(app.id)}
                          className="bg-violet/30 text-violet-bright border border-violet/40 px-2 py-0.5 rounded text-[8px] font-bold hover:bg-violet-bright hover:text-white shrink-0"
                        >
                          Select Finalist
                        </button>
                      </div>

                      {/* Compliance documents (Vetted files visible to admin only) */}
                      {app.documents && app.documents.length > 0 && (
                        <div className="pt-1.5 border-t border-hairline/25">
                          <span className="text-[8px] text-faint uppercase font-semibold block flex items-center gap-0.5 mb-1">
                            <FileCheck className="h-3 w-3 text-violet-bright" />
                            Vetted Documents:
                          </span>
                          <div className="space-y-0.5">
                            {app.documents.map((doc, idx) => (
                              <div key={idx} className="text-[8px] bg-ink/65 px-1.5 py-0.5 rounded text-cloud flex justify-between border border-hairline/20">
                                <span className="font-medium text-mist">{doc.type}:</span>
                                <span className="text-cloud/90 truncate max-w-[120px]">{doc.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 4: Choose winner */}
            <div className="border border-hairline p-3 rounded-xl bg-ink/20">
              <span className="block text-cloud font-semibold mb-2">4. Declare Cohort Winner ({finalistApps.length} Finalists)</span>
              <p className="text-[9px] text-faint mb-2">Award the $1,000 grant to a finalist. This will deduct from the Program Fund.</p>
              {finalistApps.length === 0 ? (
                <p className="text-[10px] text-faint">No active finalists. Select finalists from Candidate list.</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {finalistApps.map(app => (
                    <div key={app.id} className="flex items-center justify-between gap-2 p-2 bg-ink/40 rounded border border-hairline/50">
                      <span className="font-bold text-cloud truncate">{app.name}</span>
                      <button
                        onClick={() => simDeclareWinner(app.id, `${app.name} used their micro-grant of ${formatPrice(app.requestedAmount)} to acquire inventory and build regional infrastructure for ${app.projectName} in ${app.location}, generating local employment.`)}
                        className="bg-amber-400 text-ink px-2 py-0.5 rounded text-[9px] font-extrabold hover:bg-amber-300 shrink-0"
                      >
                        Declare Winner
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
