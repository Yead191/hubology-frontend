"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useForum } from "@/features/community-forum/forum-context";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-white/[0.03] px-2 py-3">
      <span className="font-display text-lg font-semibold text-cloud tabular-nums">
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-wide text-faint">
        {label}
      </span>
    </div>
  );
}

/** Logged-in viewer's profile summary + activity stats. */
export function ProfileCard() {
  const { currentUser, isLoggedIn, stats } = useForum();

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="border-gradient rounded-3xl bg-panel/40 p-6 text-center">
        <p className="text-sm text-mist">
          Sign in to post, comment, and track your activity.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border-gradient overflow-hidden rounded-3xl bg-panel/40">
      {/* Gradient cover */}
      <div className="h-16 bg-brand-gradient opacity-80" />

      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end gap-3">
          <Avatar className="h-16 w-16 ring-4 ring-panel">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-3">
          <h2 className="font-display text-lg font-semibold text-cloud">
            {currentUser.name}
          </h2>
          <span className="mt-1 inline-flex items-center rounded-full bg-violet/15 px-2.5 py-0.5 text-xs font-medium text-violet-bright">
            {currentUser.role === "vendor" ? "Verified expert" : "Member"}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="Posts" value={stats.posts} />
          <Stat label="Comments" value={stats.comments} />
          <Stat label="Likes" value={stats.likes} />
        </div>
      </div>
    </div>
  );
}
