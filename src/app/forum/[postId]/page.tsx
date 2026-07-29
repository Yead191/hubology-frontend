import type { Metadata } from "next";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import {
  hasForumAccess,
  mapForumComment,
  mapForumPost,
} from "@/lib/forum";
import { PostDetail } from "@/features/community-forum/sections/post-detail";
import { ForumLockCard } from "@/features/membership/sections/forum-lock";
import { Aurora } from "@/components/ui/aurora";

export const metadata: Metadata = {
  title: "Post · Community Forum",
  description: "Read the full discussion and join the conversation.",
};

interface PageProps {
  params: Promise<{ postId: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
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

  const [postRes, commentsRes] = await Promise.all([
    nextFetch(`/posts/${postId}`, {
      method: "GET",
      cache: "no-store",
      tags: [`forum-post-${postId}`],
    }),
    nextFetch(`/comment/${postId}`, {
      method: "GET",
      cache: "no-store",
      tags: [`forum-comments-${postId}`],
    }),
  ]);

  const post = postRes.success && postRes.data ? mapForumPost(postRes.data) : null;
  const comments = commentsRes.success
    ? (commentsRes.data ?? []).map(mapForumComment)
    : [];

  return <PostDetail post={post} comments={comments} />;
}
