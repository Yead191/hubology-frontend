import type { Metadata } from "next";
import { redirect } from "next/navigation";

import getProfile from "@/helpers/next-fetch/getProfile";
import { PartnerApplyForm } from "@/features/partners/sections/partner-apply-form";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Become a Partner",
  "Apply to join the Hubology partner network.",
);

export default async function PartnerApplyPage() {
  const profile = await getProfile();

  if (!profile?._id) {
    redirect(`/login?redirect=${encodeURIComponent("/partners/apply")}`);
  }

  return <PartnerApplyForm />;
}
