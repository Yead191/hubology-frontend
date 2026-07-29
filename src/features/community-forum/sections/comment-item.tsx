"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import type { ForumComment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForum } from "@/features/community-forum/forum-context";
import {
  deleteForumComment,
  updateForumComment,
} from "@/helpers/next-fetch/forumActions";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** A single comment with optional edit/delete for the author. */
export function CommentItem({
  comment,
  postId,
}: {
  comment: ForumComment;
  postId?: string;
}) {
  const router = useRouter();
  const { userId } = useForum();
  const isVendor = comment.author.role === "vendor";
  const isOwn = Boolean(userId && comment.author.id === userId);

  const [editOpen, setEditOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [text, setText] = React.useState(comment.text);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (editOpen) setText(comment.text);
  }, [editOpen, comment.text]);

  async function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const res = await updateForumComment(comment.id, trimmed);
      if (!res.success) {
        toast.error(res.message || "Could not update comment.", {
          id: "comment-edit",
        });
        return;
      }
      toast.success("Comment updated", { id: "comment-edit" });
      setEditOpen(false);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.", { id: "comment-edit" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      const res = await deleteForumComment(comment.id, postId);
      if (!res.success) {
        toast.error(res.message || "Could not delete comment.", {
          id: "comment-del",
        });
        return;
      }
      toast.success("Comment deleted", { id: "comment-del" });
      setConfirmOpen(false);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.", { id: "comment-del" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0 ring-1 ring-hairline-strong">
        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
        <AvatarFallback className="text-xs">
          {initials(comment.author.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-sm border border-hairline bg-white/3 px-4 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-cloud">
                {comment.author.name}
              </span>
              {isVendor ? (
                <BadgeCheck
                  className="h-3.5 w-3.5 text-violet-bright"
                  aria-label="Verified expert"
                />
              ) : null}
            </div>
            {isOwn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Comment options"
                    className="grid h-7 w-7 place-items-center rounded-full text-faint hover:bg-white/6 hover:text-cloud"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setConfirmOpen(true)}
                    className="text-destructive focus:bg-destructive/15 focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
          <p className={cn("mt-0.5 text-sm leading-relaxed text-cloud/85")}>
            {comment.text}
          </p>
        </div>
        <span className="ml-1 mt-1 inline-block text-xs text-faint">
          {comment.timeAgo}
        </span>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit comment"
        className="max-w-md"
      >
        <div className="flex flex-col gap-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-24"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setEditOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !text.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete comment?"
        description="This can't be undone."
        className="max-w-md"
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setConfirmOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={saving}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Delete
          </Button>
        </div>
      </Modal>
    </li>
  );
}
