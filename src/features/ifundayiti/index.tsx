"use client";

import React from "react";
import { IFundAyitiProvider } from "./context/ifundayiti-context";
import { IFundAyitiHero } from "./sections/hero";
import { IFundAyitiAbout } from "./sections/about";
import { IFundAyitiHowItWorks } from "./sections/how-it-works";
import { IFundAyitiStats } from "./sections/stats";
import { IFundAyitiApplicants } from "./sections/applicants";
import { IFundAyitiFinalists } from "./sections/finalists";
import { IFundAyitiWinners } from "./sections/winners";
import { IFundAyitiFindApplication } from "./sections/find-application";
import { IFundAyitiApplicationModal } from "./sections/application-modal";
import { IFundAyitiDonationModal } from "./sections/donation-modal";
import { IFundAyitiProfileModal } from "./sections/profile-modal";
import { CtaBand } from "@/components/sections/cta-band";
import { IFundAyitiBoardSimulator } from "./sections/board-simulator";

function IFundAyitiContent() {
  return (
    <div className="relative min-h-screen bg-ink text-cloud overflow-hidden">

      {/* Visual sections */}
      <IFundAyitiHero />
      <IFundAyitiStats />

      {/* Status Lookup */}
      <IFundAyitiFindApplication />

      <IFundAyitiAbout />
      <IFundAyitiHowItWorks />

      {/* Interactive grids */}
      <IFundAyitiFinalists />
      <IFundAyitiApplicants />
      <IFundAyitiWinners />

      {/* General Call to Action */}
      <CtaBand />

      {/* Overlay Modals */}
      <IFundAyitiApplicationModal />
      <IFundAyitiDonationModal />
      <IFundAyitiProfileModal />

      {/* Board Simulator Control Panel */}
      <IFundAyitiBoardSimulator />

    </div>
  );
}

export default function IFundAyiti() {
  return (
    <IFundAyitiProvider>
      <IFundAyitiContent />
    </IFundAyitiProvider>
  );
}
