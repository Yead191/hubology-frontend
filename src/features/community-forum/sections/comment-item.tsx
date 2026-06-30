import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ForumComment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** A single comment rendered as a chat-style bubble. */
export function CommentItem({ comment }: { comment: ForumComment }) {
  const isVendor = comment.author.role === "vendor";
  return (
    <li className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0 ring-1 ring-hairline-strong">
        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
        <AvatarFallback className="text-xs">
          {initials(comment.author.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-sm border border-hairline bg-white/[0.03] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-cloud">
              {comment.author.name}
            </span>
            {isVendor && (
              <BadgeCheck
                className="h-3.5 w-3.5 text-violet-bright"
                aria-label="Verified expert"
              />
            )}
          </div>
          <p className={cn("mt-0.5 text-sm leading-relaxed text-cloud/85")}>
            {comment.text}
          </p>
        </div>
        <span className="ml-1 mt-1 inline-block text-xs text-faint">
          {comment.timeAgo}
        </span>
      </div>
    </li>
  );
}
