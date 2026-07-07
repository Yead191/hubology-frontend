import type { Metadata } from "next";
import { IFundAyitiProvider } from "@/features/ifundayiti/context/ifundayiti-context";
import { IFundAyitiTrackDetails } from "@/features/ifundayiti/sections/track-details";

export const metadata: Metadata = {
  title: "Track Application · IFundAyiti",
  description:
    "Review your submitted micro-grant application status, project details, and vetting board progress.",
};

export default function TrackApplicationPage() {
  return (
    <IFundAyitiProvider>
      <IFundAyitiTrackDetails />
    </IFundAyitiProvider>
  );
}
