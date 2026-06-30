"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { ForumPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForum } from "@/features/community-forum/forum-context";
import { NewPostModal } from "./new-post-modal";

/**
 * Owner-only "⋯" menu for a post: edit (re-opens the composer in edit
 * mode) and delete (with a confirmation step). Renders nothing for
 * posts the current user didn't author.
 */
export function PostMenu({
  post,
  onDeleted,
}: {
  post: ForumPost;
  /** Called after a successful delete — e.g. to navigate away. */
  onDeleted?: () => void;
}) {
  const { isOwnPost, deletePost } = useForum();
  const [editOpen, setEditOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (!isOwnPost(post)) return null;

  const handleDelete = () => {
    deletePost(post.id);
    setConfirmOpen(false);
    onDeleted?.();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Post options"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-white/[0.06] hover:text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/25"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit post
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setConfirmOpen(true)}
            className="text-destructive focus:bg-destructive/15 focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit composer */}
      <NewPostModal open={editOpen} onClose={() => setEditOpen(false)} post={post} />

      {/* Delete confirmation */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this post?"
        description="This permanently removes the post and its comments. This can't be undone."
        className="max-w-md"
      >
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground shadow-[0_10px_30px_-10px_rgba(240,67,106,0.7)] hover:bg-destructive/90 hover:shadow-[0_16px_44px_-12px_rgba(240,67,106,0.9)]"
          >
            <Trash2 className="h-4 w-4" />
            Delete post
          </Button>
        </div>
      </Modal>
    </>
  );
}
