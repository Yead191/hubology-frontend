import type { Metadata } from "next";
import { IFundAyitiProvider } from "@/features/ifundayiti/context/ifundayiti-context";
import { IFundAyitiTrackDetails } from "@/features/ifundayiti/sections/track-details";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Track IFundAyiti Application",
  description:
    "Track your IFundAyiti micro-grant application status, project details, and vetting board progress.",
  path: "/ifundayiti/track",
  keywords: [
    "track micro grant application",
    "IFundAyiti application status",
    "Haiti grant tracking",
  ],
  noIndex: true,
});

export default function TrackApplicationPage() {
  return (
    <IFundAyitiProvider>
      <IFundAyitiTrackDetails />
    </IFundAyitiProvider>
  );
}
