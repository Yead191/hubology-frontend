import type { Metadata } from "next";

import type { UserSubscription } from "@/types";
import getProfile from "@/helpers/next-fetch/getProfile";
import { PostDetail } from "@/features/community-forum/sections/post-detail";
import { ForumLockCard } from "@/features/membership/sections/forum-lock";
import { Aurora } from "@/components/ui/aurora";

export const metadata: Metadata = {
  title: "Post · Community Forum",
  description: "Read the full discussion and join the conversation.",
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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const user = await getProfile();
  const unlocked = hasForumAccess(user);

  if (!unlocked) {
    return (
      <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
        <Aurora
          animated
          className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
        />
        <div className="relative mx-auto flex max-w-6xl justify-center px-4 sm:px-6">
          <ForumLockCard isLoggedIn={Boolean(user)} />
        </div>
      </section>
    );
  }

  return <PostDetail postId={postId} />;
}
