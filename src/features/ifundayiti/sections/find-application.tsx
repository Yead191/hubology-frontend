"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function IFundAyitiFindApplication() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [dob, setDob] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!trackingId.trim()) {
      setErrorMsg("Please enter your Tracking ID");
      return;
    }
    if (!dob.trim()) {
      setErrorMsg("Please enter your Date of Birth");
      return;
    }

    router.push(`/ifundayiti/track?id=${trackingId.trim()}&dob=${dob.trim()}`);
  };

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
              Check the status of your micro-grant submission securely. You can review and view your full submitted details.
            </p>
          </Reveal>
        </div>

        <Reveal className="border-gradient rounded-3xl bg-panel/30 p-8 backdrop-blur-md">
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
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-ink/50 border-hairline text-cloud h-11 focus:ring-violet/40 focus:border-violet block w-full pr-10"
              />
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
        </Reveal>

      </div>
    </section>
  );
}
