import type { Metadata } from "next";

import type { UserSubscription } from "@/types";
import getProfile from "@/helpers/next-fetch/getProfile";
import CommunityForum from "@/features/community-forum";

export const metadata: Metadata = {
  title: "Community Forum",
  description:
    "Ask questions and get answers from verified experts — coming soon.",
};

function hasActiveSubscription(subscription?: UserSubscription | null) {
  if (!subscription?.name) return false;
  if (!subscription.end_date) return true;
  return new Date(subscription.end_date).getTime() > Date.now();
}

function hasForumAccess(user: {
  role?: string;
  subscription?: UserSubscription | null;
} | null) {
  if (!user) return false;
  const role = (user.role ?? "").toLowerCase();
  if (role === "expert" || role === "vendor") return true;
  return hasActiveSubscription(user.subscription);
}

export default async function ForumPage() {
  const user = await getProfile();
  const unlocked = hasForumAccess(user);

  return (
    <CommunityForum
      hasForumAccess={unlocked}
      isLoggedIn={Boolean(user)}
    />
  );
}
