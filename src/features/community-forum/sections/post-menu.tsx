"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { deleteForumPost } from "@/helpers/next-fetch/forumActions";
import { NewPostModal } from "./new-post-modal";
import { ReportModal } from "./report-modal";

export function PostMenu({
  post,
  onDeleted,
}: {
  post: ForumPost;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const { isOwnPost } = useForum();
  const [editOpen, setEditOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const own = isOwnPost(post);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await deleteForumPost(post.id);
      if (!res.success) {
        toast.error(res.message || "Could not delete post.", {
          id: "delete-post",
        });
        return;
      }
      toast.success("Post deleted", { id: "delete-post" });
      setConfirmOpen(false);
      onDeleted?.();
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.", { id: "delete-post" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Post options"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-white/6 hover:text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/25"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          {own ? (
            <>
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
            </>
          ) : (
            <DropdownMenuItem
              onSelect={() => setReportOpen(true)}
              className="text-destructive focus:bg-destructive/15 focus:text-destructive"
            >
              <Flag className="h-4 w-4" />
              Report post
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <NewPostModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        post={post}
      />

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this post?"
        description="This permanently removes the post and its comments. This can't be undone."
        className="max-w-md"
      >
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setConfirmOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground shadow-[0_10px_30px_-10px_rgba(240,67,106,0.7)] hover:bg-destructive/90"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete post
          </Button>
        </div>
      </Modal>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        post={post}
      />
    </>
  );
}
