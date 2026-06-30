import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ForumAuthor } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Avatar + name (+ verified expert mark) + optional headline / timestamp. */
export function AuthorByline({
  author,
  timeAgo,
  size = "md",
  className,
}: {
  author: ForumAuthor;
  timeAgo?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const isVendor = author.role === "vendor";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar
        className={cn(
          "ring-2 ring-hairline-strong",
          size === "sm" ? "h-8 w-8" : "h-11 w-11",
        )}
      >
        <AvatarImage src={author.avatarUrl} alt={author.name} />
        <AvatarFallback>{initials(author.name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate font-semibold text-cloud",
              size === "sm" ? "text-sm" : "text-[15px]",
            )}
          >
            {author.name}
          </span>
          {isVendor && (
            <span
              className="inline-flex items-center gap-0.5 text-violet-bright"
              title="Verified expert"
            >
              <BadgeCheck className="h-4 w-4" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-faint">
          <span className={isVendor ? "text-violet-bright/80" : ""}>
            {isVendor ? author.headline ?? "Verified expert" : "Member"}
          </span>
          {timeAgo && (
            <>
              <span aria-hidden>·</span>
              <span>{timeAgo}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
