import getProfile from "@/helpers/next-fetch/getProfile";
import { ForumProvider } from "@/features/community-forum/forum-context";

/**
 * Wraps all /forum routes in the ForumProvider so the feed and the
 * post-detail page share the same in-session state. Auth comes from
 * getProfile (accessToken cookie) — not the removed mock auth context.
 */
export default async function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();

  return <ForumProvider user={user}>{children}</ForumProvider>;
}
