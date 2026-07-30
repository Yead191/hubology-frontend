import type { Metadata } from "next";

import getProfile from "@/helpers/next-fetch/getProfile";
import { ProfileForms } from "@/features/dashboard/profile-forms";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function DashboardProfilePage() {
  const user = await getProfile();
  return <ProfileForms user={user ?? {}} />;
}
