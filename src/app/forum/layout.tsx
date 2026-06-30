import { ForumProvider } from "@/features/community-forum/forum-context";

/**
 * Wraps all /forum routes in the ForumProvider so the feed and the
 * post-detail page share the same in-session state (likes, new
 * comments, and new posts persist while navigating within the forum).
 */
export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ForumProvider>{children}</ForumProvider>;
}
