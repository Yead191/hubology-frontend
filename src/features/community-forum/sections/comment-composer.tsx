"use client";

import * as React from "react";
import Link from "next/link";
import { SendHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForum } from "@/features/community-forum/forum-context";

/** Inline input to add a comment to a post. Posts on Enter or button. */
export function CommentComposer({
  postId,
  autoFocus = false,
}: {
  postId: string;
  autoFocus?: boolean;
}) {
  const { currentUser, isLoggedIn, addComment } = useForum();
  const [text, setText] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  if (!isLoggedIn || !currentUser) {
    return (
      <p className="rounded-2xl border border-hairline bg-white/[0.02] px-4 py-3 text-sm text-mist">
        <Link href="/login" className="font-medium text-violet-bright hover:underline">
          Sign in
        </Link>{" "}
        to join the conversation.
      </p>
    );
  }

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment(postId, trimmed);
    setText("");
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 shrink-0 ring-1 ring-hairline-strong">
        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
        <AvatarFallback className="text-xs">
          {currentUser.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="relative flex-1">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Write a comment…"
          className={cn(
            "h-11 w-full rounded-full border border-input bg-white/[0.03] pl-4 pr-12 text-sm text-cloud transition-colors",
            "placeholder:text-faint focus-visible:outline-none focus-visible:border-violet/60 focus-visible:ring-2 focus-visible:ring-violet/25",
          )}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          aria-label="Post comment"
          className={cn(
            "absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full transition-all",
            text.trim()
              ? "bg-brand-gradient text-white shadow-[0_6px_18px_-6px_rgba(129,49,240,0.8)]"
              : "text-faint",
          )}
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
