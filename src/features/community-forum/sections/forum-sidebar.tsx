"use client";

import { Plus, Newspaper, FileText, MessageSquare, Heart, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForum } from "@/features/community-forum/forum-context";
import { ProfileCard } from "./profile-card";

export type ForumTab = "feed" | "posts" | "comments" | "likes";

interface TabDef {
  id: ForumTab;
  label: string;
  icon: LucideIcon;
  /** Which stat (if any) drives the trailing count. */
  count?: "posts" | "comments" | "likes";
}

const TABS: TabDef[] = [
  { id: "feed", label: "Community Feed", icon: Newspaper },
  { id: "posts", label: "My Posts", icon: FileText, count: "posts" },
  { id: "comments", label: "My Comments", icon: MessageSquare, count: "comments" },
  { id: "likes", label: "My Likes", icon: Heart, count: "likes" },
];

/** Left rail: profile summary, activity tabs, and the new-post CTA. */
export function ForumSidebar({
  active,
  onChange,
  onNewPost,
}: {
  active: ForumTab;
  onChange: (tab: ForumTab) => void;
  onNewPost: () => void;
}) {
  const { isLoggedIn, stats } = useForum();

  return (
    <aside className="flex flex-col gap-5">
      <ProfileCard />

      {isLoggedIn && (
        <Button onClick={onNewPost} size="lg" className="w-full">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      )}

      <nav className="border-gradient flex flex-col gap-1 rounded-3xl bg-panel/40 p-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          const count = tab.count ? stats[tab.count] : undefined;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/6 text-cloud ring-1 ring-hairline-strong"
                  : "text-mist hover:bg-white/4 hover:text-cloud",
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5",
                  isActive ? "text-violet-bright" : "text-faint",
                )}
              />
              <span className="flex-1 text-left">{tab.label}</span>
              {count !== undefined && (
                <span
                  className={cn(
                    "min-w-6 rounded-full px-2 py-0.5 text-center text-xs tabular-nums",
                    isActive
                      ? "bg-violet/20 text-violet-bright"
                      : "bg-white/5 text-faint",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
