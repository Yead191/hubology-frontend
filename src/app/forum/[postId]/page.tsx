import type { Metadata } from "next";

import { PostDetail } from "@/features/community-forum/sections/post-detail";

export const metadata: Metadata = {
  title: "Post · Community Forum",
  description: "Read the full discussion and join the conversation.",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <PostDetail postId={postId} />;
}
