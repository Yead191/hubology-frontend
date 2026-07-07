"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  IFundApplicant,
  IFundWinner,
  IFundDonation,
  INITIAL_STATS,
  INITIAL_PERIOD,
  INITIAL_APPLICANTS,
  INITIAL_WINNERS,
  INITIAL_DONATIONS,
} from "../data/mock-data";

interface IFundAyitiContextType {
  stats: typeof INITIAL_STATS;
  period: typeof INITIAL_PERIOD;
  applicants: IFundApplicant[];
  winners: IFundWinner[];
  donations: IFundDonation[];
  showAppModal: boolean;
  setShowAppModal: (show: boolean) => void;
  showDonModal: boolean;
  setShowDonModal: (show: boolean) => void;
  activeApplicantProfile: IFundApplicant | null;
  setActiveApplicantProfile: (applicant: IFundApplicant | null) => void;
  searchResult: IFundApplicant | null | undefined; // null = not found, undefined = not searched yet
  searchApplication: (trackingId: string, dob: string) => void;
  clearSearch: () => void;
  submitApplication: (data: Omit<IFundApplicant, "id" | "status" | "submissionDate" | "periodId" | "photoUrl"> & { photoBase64?: string }) => string;
  submitDonation: (name: string, email: string, amount: number) => void;
  
  // Simulator triggers
  simApproveApplicant: (id: string) => void;
  simRejectApplicant: (id: string) => void;
  simSelectFinalist: (id: string) => void;
  simDeclareWinner: (id: string, successStory: string) => void;
  simUpdatePeriodStatus: (status: string) => void;
  simResetData: () => void;
}

const IFundAyitiContext = createContext<IFundAyitiContextType | undefined>(undefined);

export function IFundAyitiProvider({ children }: { children: React.ReactNode }) {
  // Stats state
  const [stats, setStats] = useState(INITIAL_STATS);
  // Period state
  const [period, setPeriod] = useState(INITIAL_PERIOD);
  // Applicants state
  const [applicants, setApplicants] = useState<IFundApplicant[]>([]);
  // Winners state
  const [winners, setWinners] = useState<IFundWinner[]>([]);
  // Donations state
  const [donations, setDonations] = useState<IFundDonation[]>([]);
  
  // Modals state
  const [showAppModal, setShowAppModal] = useState(false);
  const [showDonModal, setShowDonModal] = useState(false);
  const [activeApplicantProfile, setActiveApplicantProfile] = useState<IFundApplicant | null>(null);
  
  // Search state
  const [searchResult, setSearchResult] = useState<IFundApplicant | null | undefined>(undefined);

  // Initialize and load from local storage
  useEffect(() => {
    const localStats = localStorage.getItem("ifa_stats");
    const localPeriod = localStorage.getItem("ifa_period");
    const localApplicants = localStorage.getItem("ifa_applicants");
    const localWinners = localStorage.getItem("ifa_winners");
    const localDonations = localStorage.getItem("ifa_donations");

    if (localStats) setStats(JSON.parse(localStats));
    else setStats(INITIAL_STATS);

    if (localPeriod) setPeriod(JSON.parse(localPeriod));
    else setPeriod(INITIAL_PERIOD);

    if (localApplicants) setApplicants(JSON.parse(localApplicants));
    else setApplicants(INITIAL_APPLICANTS);

    if (localWinners) setWinners(JSON.parse(localWinners));
    else setWinners(INITIAL_WINNERS);

    if (localDonations) setDonations(JSON.parse(localDonations));
    else setDonations(INITIAL_DONATIONS);
  }, []);

  // Helpers to update and save to localStorage
  const updateStats = (newStats: typeof INITIAL_STATS) => {
    setStats(newStats);
    localStorage.setItem("ifa_stats", JSON.stringify(newStats));
  };

  const updatePeriod = (newPeriod: typeof INITIAL_PERIOD) => {
    setPeriod(newPeriod);
    localStorage.setItem("ifa_period", JSON.stringify(newPeriod));
  };

  const updateApplicants = (newApplicants: IFundApplicant[]) => {
    setApplicants(newApplicants);
    localStorage.setItem("ifa_applicants", JSON.stringify(newApplicants));
  };

  const updateWinners = (newWinners: IFundWinner[]) => {
    setWinners(newWinners);
    localStorage.setItem("ifa_winners", JSON.stringify(newWinners));
  };

  const updateDonations = (newDonations: IFundDonation[]) => {
    setDonations(newDonations);
    localStorage.setItem("ifa_donations", JSON.stringify(newDonations));
  };

  // Submit Application
  const submitApplication = (
    data: Omit<IFundApplicant, "id" | "status" | "submissionDate" | "periodId" | "photoUrl"> & { photoBase64?: string }
  ): string => {
    // Generate tracking ID e.g. IFA-2026-000149
    const year = new Date().getFullYear();
    const count = stats.totalApplications + 1;
    const paddedCount = String(count).padStart(6, "0");
    const trackingId = `IFA-${year}-${paddedCount}`;

    const defaultPhotos = [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=300",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300"
    ];
    const mockPhoto = data.photoBase64 || defaultPhotos[count % defaultPhotos.length];

    const newApplicant: IFundApplicant = {
      ...data,
      id: trackingId,
      status: "Submitted",
      submissionDate: new Date().toISOString().split("T")[0],
      periodId: period.id,
      photoUrl: mockPhoto,
      story: data.story || `Project startup focused on ${data.projectName} to support local community development in ${data.location}.`
    };

    const updatedApps = [newApplicant, ...applicants];
    updateApplicants(updatedApps);

    updateStats({
      ...stats,
      totalApplications: count,
    });

    return trackingId;
  };

  // Submit Donation
  const submitDonation = (name: string, email: string, amount: number) => {
    const newDonation: IFundDonation = {
      id: `DON-${Date.now().toString().slice(-4)}`,
      name: name || "Anonymous Donor",
      amount,
      date: new Date().toISOString().split("T")[0],
      status: "Successful",
    };

    updateDonations([newDonation, ...donations]);
    updateStats({
      ...stats,
      totalDonations: stats.totalDonations + amount,
      currentProgramFund: stats.currentProgramFund + amount,
    });
  };

  // Search Application
  const searchApplication = (trackingId: string, dob: string) => {
    const found = applicants.find(
      (app) =>
        app.id.trim().toLowerCase() === trackingId.trim().toLowerCase() &&
        app.dob.trim() === dob.trim()
    );
    setSearchResult(found || null);
  };

  const clearSearch = () => {
    setSearchResult(undefined);
  };

  // Simulation controls
  const simApproveApplicant = (id: string) => {
    const updated = applicants.map((app) => {
      if (app.id === id) {
        return { ...app, status: "Approved" as const };
      }
      return app;
    });
    updateApplicants(updated);
    
    // Increment approved stats if it wasn't approved before
    const wasApproved = applicants.find(a => a.id === id)?.status === "Approved";
    if (!wasApproved) {
      updateStats({
        ...stats,
        approvedApplicants: stats.approvedApplicants + 1
      });
    }
  };

  const simRejectApplicant = (id: string) => {
    const updated = applicants.map((app) => {
      if (app.id === id) {
        return { ...app, status: "Rejected" as const };
      }
      return app;
    });
    updateApplicants(updated);
  };

  const simSelectFinalist = (id: string) => {
    const updated = applicants.map((app) => {
      if (app.id === id) {
        return { ...app, status: "Top 5 Finalist" as const };
      }
      return app;
    });
    updateApplicants(updated);
  };

  const simDeclareWinner = (id: string, successStory: string) => {
    const applicant = applicants.find((app) => app.id === id);
    if (!applicant) return;

    // Check if applicant is already a winner to avoid double-deduction
    if (applicant.status === "Winner") return;

    // Deduct grant from fund, increase winners count
    const grantAmount = applicant.requestedAmount;

    // Update applicant status
    const updatedApplicants = applicants.map((app) => {
      if (app.id === id) {
        return { ...app, status: "Winner" as const };
      }
      // Archive other finalists from this period
      if (app.status === "Top 5 Finalist" && app.periodId === applicant.periodId) {
        return { ...app, status: "Archived" as const };
      }
      return app;
    });
    updateApplicants(updatedApplicants);

    // Create winner card
    const newWinner: IFundWinner = {
      id: applicant.id,
      name: applicant.name,
      projectName: applicant.projectName,
      awardedAmount: grantAmount,
      period: period.title,
      successStory: successStory || `Winner of the ${period.title}. The grant was utilized to bootstrap and scale operations in ${applicant.location}.`,
      photoUrl: applicant.photoUrl,
      additionalPhotos: [],
    };
    updateWinners([newWinner, ...winners]);

    updateStats({
      ...stats,
      currentProgramFund: Math.max(0, stats.currentProgramFund - grantAmount),
      totalWinners: stats.totalWinners + 1,
    });
  };

  const simUpdatePeriodStatus = (status: string) => {
    updatePeriod({
      ...period,
      status,
    });
  };

  const simResetData = () => {
    localStorage.removeItem("ifa_stats");
    localStorage.removeItem("ifa_period");
    localStorage.removeItem("ifa_applicants");
    localStorage.removeItem("ifa_winners");
    localStorage.removeItem("ifa_donations");
    
    setStats(INITIAL_STATS);
    setPeriod(INITIAL_PERIOD);
    setApplicants(INITIAL_APPLICANTS);
    setWinners(INITIAL_WINNERS);
    setDonations(INITIAL_DONATIONS);
    setSearchResult(undefined);
  };

  return (
    <IFundAyitiContext.Provider
      value={{
        stats,
        period,
        applicants,
        winners,
        donations,
        showAppModal,
        setShowAppModal,
        showDonModal,
        setShowDonModal,
        activeApplicantProfile,
        setActiveApplicantProfile,
        searchResult,
        searchApplication,
        clearSearch,
        submitApplication,
        submitDonation,
        
        simApproveApplicant,
        simRejectApplicant,
        simSelectFinalist,
        simDeclareWinner,
        simUpdatePeriodStatus,
        simResetData,
      }}
    >
      {children}
    </IFundAyitiContext.Provider>
  );
}

export function useIFundAyiti() {
  const context = useContext(IFundAyitiContext);
  if (context === undefined) {
    throw new Error("useIFundAyiti must be used within an IFundAyitiProvider");
  }
  return context;
}
