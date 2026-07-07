"use client";

import React, { useRef } from "react";
import { AlertCircle, FileUp, Check } from "lucide-react";

interface FileMock {
  name: string;
  size?: string;
}

interface StepDocumentsProps {
  govIdFile: FileMock | null;
  setGovIdFile: (f: FileMock | null) => void;
  proofAddrFile: FileMock | null;
  setProofAddrFile: (f: FileMock | null) => void;
  businessPlanFile: FileMock | null;
  setBusinessPlanFile: (f: FileMock | null) => void;
  fileError: string;
}

export function StepDocuments({
  govIdFile,
  setGovIdFile,
  proofAddrFile,
  setProofAddrFile,
  businessPlanFile,
  setBusinessPlanFile,
  fileError
}: StepDocumentsProps) {
  
  const idRef = useRef<HTMLInputElement>(null);
  const addrRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "addr" | "plan") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(1) + " MB" 
      : (file.size / 1024).toFixed(0) + " KB";

    const mockFile: FileMock = {
      name: file.name,
      size: formattedSize
    };

    if (type === "id") setGovIdFile(mockFile);
    else if (type === "addr") setProofAddrFile(mockFile);
    else if (type === "plan") setBusinessPlanFile(mockFile);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Warning:</strong> Missing required documents may result in your application being rejected during the screening process.
        </p>
      </div>

      {/* Upload Item 1: ID */}
      <div className="border border-hairline rounded-2xl p-4 bg-ink/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <span className="block text-sm font-semibold text-cloud">Government-issued ID *</span>
          <span className="text-xs text-faint block">National ID Card or Passport Scan (Required)</span>
          {govIdFile && (
            <span className="mt-2 text-xs font-semibold text-emerald-300 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
              <Check className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[200px]">{govIdFile.name}</span>
              <span className="text-[10px] opacity-75">({govIdFile.size})</span>
            </span>
          )}
        </div>
        
        <input
          type="file"
          ref={idRef}
          onChange={(e) => handleFileChange(e, "id")}
          className="hidden"
          accept="image/*,.pdf"
        />
        
        <button
          type="button"
          onClick={() => idRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-cloud px-4 py-2.5 border border-hairline bg-white/3 hover:bg-white/8 rounded-xl outline-none transition-all duration-200 hover:border-violet/40 cursor-pointer"
        >
          <FileUp className="h-4 w-4" />
          <span>{govIdFile ? "Change File" : "Upload ID Scans"}</span>
        </button>
      </div>

      {/* Upload Item 2: Proof of Address */}
      <div className="border border-hairline rounded-2xl p-4 bg-ink/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <span className="block text-sm font-semibold text-cloud">Proof of Address *</span>
          <span className="text-xs text-faint block">Utility Bill, Tax Record, or Rent Slip (Required)</span>
          {proofAddrFile && (
            <span className="mt-2 text-xs font-semibold text-emerald-300 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
              <Check className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[200px]">{proofAddrFile.name}</span>
              <span className="text-[10px] opacity-75">({proofAddrFile.size})</span>
            </span>
          )}
        </div>

        <input
          type="file"
          ref={addrRef}
          onChange={(e) => handleFileChange(e, "addr")}
          className="hidden"
          accept="image/*,.pdf"
        />

        <button
          type="button"
          onClick={() => addrRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-cloud px-4 py-2.5 border border-hairline bg-white/3 hover:bg-white/8 rounded-xl outline-none transition-all duration-200 hover:border-violet/40 cursor-pointer"
        >
          <FileUp className="h-4 w-4" />
          <span>{proofAddrFile ? "Change File" : "Upload Proof Scan"}</span>
        </button>
      </div>

      {/* Upload Item 3: Business Plan */}
      <div className="border border-hairline rounded-2xl p-4 bg-ink/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <span className="block text-sm font-semibold text-cloud">Business Plan / Images</span>
          <span className="text-xs text-faint block">Mock plan, supporting product images (Optional)</span>
          {businessPlanFile && (
            <span className="mt-2 text-xs font-semibold text-emerald-300 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
              <Check className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[200px]">{businessPlanFile.name}</span>
              <span className="text-[10px] opacity-75">({businessPlanFile.size})</span>
            </span>
          )}
        </div>

        <input
          type="file"
          ref={planRef}
          onChange={(e) => handleFileChange(e, "plan")}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        <button
          type="button"
          onClick={() => planRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-cloud px-4 py-2.5 border border-hairline bg-white/3 hover:bg-white/8 rounded-xl outline-none transition-all duration-200 hover:border-violet/40 cursor-pointer"
        >
          <FileUp className="h-4 w-4" />
          <span>{businessPlanFile ? "Change File" : "Upload Plan File"}</span>
        </button>
      </div>

      {fileError && (
        <div className="flex items-center gap-2 text-xs text-rose-400 mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>{fileError}</span>
        </div>
      )}
    </div>
  );
}
