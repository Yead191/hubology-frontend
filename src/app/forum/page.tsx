import type { Metadata } from "next";

import CommunityForum from "@/features/community-forum";

export const metadata: Metadata = {
  title: "Community Forum",
  description: "Ask questions and get answers from verified experts — coming soon.",
};

export default function ForumPage() {
  return (
    <CommunityForum />
  );
}
