"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Inbox, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { io, type Socket } from "socket.io-client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getNotificationsAction,
  readAllNotificationsAction,
  readNotificationAction,
  type NotificationItem,
  type NotificationsPayload,
} from "./actions";

interface TopbarNotificationsProps {
  userId?: string;
  className?: string;
}

const PAGE_LIMIT = 10;

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff) || diff < 0) return "";
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function parsePayload(data: NotificationsPayload | undefined | null) {
  if (!data || typeof data !== "object") {
    return { list: [] as NotificationItem[], unreadCount: 0 };
  }
  const list = Array.isArray(data.data) ? data.data : [];
  const unreadCount =
    typeof data.unreadCount === "number"
      ? data.unreadCount
      : list.filter((n) => !n.seen).length;
  return { list, unreadCount };
}

function resolveNotificationPath(path?: string) {
  if (!path) return undefined;
  if (path === "/subscriptions" || path === "/orders") {
    return `/dashboard${path}`;
  }
  if (path.startsWith("/dashboard")) return path;
  return path;
}

export function TopbarNotifications({
  userId,
  className,
}: TopbarNotificationsProps) {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);

  const pageRef = React.useRef(1);
  const totalPageRef = React.useRef(1);
  const loadingMoreRef = React.useRef(false);
  const fetchingRef = React.useRef(false);
  const openRef = React.useRef(false);
  const fetchGenRef = React.useRef(0);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const syncRef = React.useRef<(opts?: { quiet?: boolean }) => Promise<void>>(
    async () => {},
  );

  const hasMore = page < totalPage;

  const syncFromServer = React.useCallback(
    async (opts?: { quiet?: boolean }) => {
      if (!userId) return;

      const gen = ++fetchGenRef.current;
      fetchingRef.current = true;
      if (!opts?.quiet) setIsFetching(true);

      try {
        const res = await getNotificationsAction(1, PAGE_LIMIT);
        // Ignore stale responses (e.g. an older socket sync finishing late).
        if (gen !== fetchGenRef.current) return;

        if (res.success) {
          const { list, unreadCount: count } = parsePayload(res.data);
          setNotifications(list);
          setUnreadCount(count);

          const nextPage = Number(res.pagination?.page) || 1;
          const nextTotal = Number(res.pagination?.totalPage) || 1;
          pageRef.current = nextPage;
          totalPageRef.current = nextTotal;
          setPage(nextPage);
          setTotalPage(nextTotal);
          loadingMoreRef.current = false;
        } else if (!opts?.quiet) {
          toast.error(res.message || "Failed to load notifications.", {
            id: "notifications",
          });
        }
      } catch {
        if (!opts?.quiet && gen === fetchGenRef.current) {
          toast.error("Network error. Please try again.", {
            id: "notifications",
          });
        }
      } finally {
        if (gen === fetchGenRef.current) {
          fetchingRef.current = false;
          setIsFetching(false);
        }
      }
    },
    [userId],
  );

  syncRef.current = syncFromServer;

  const loadMore = React.useCallback(async () => {
    if (
      !userId ||
      fetchingRef.current ||
      loadingMoreRef.current ||
      pageRef.current >= totalPageRef.current
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    const nextPage = pageRef.current + 1;
    const gen = fetchGenRef.current;

    try {
      const res = await getNotificationsAction(nextPage, PAGE_LIMIT);
      if (gen !== fetchGenRef.current) return;

      if (res.success) {
        const { list: incoming, unreadCount: count } = parsePayload(res.data);

        setNotifications((prev) => {
          const seenIds = new Set(prev.map((n) => n._id));
          const fresh = incoming.filter((n) => !seenIds.has(n._id));
          return fresh.length ? [...prev, ...fresh] : prev;
        });
        setUnreadCount(count);

        const resolvedPage = Number(res.pagination?.page) || nextPage;
        const resolvedTotal =
          Number(res.pagination?.totalPage) || totalPageRef.current;
        pageRef.current = resolvedPage;
        totalPageRef.current = resolvedTotal;
        setPage(resolvedPage);
        setTotalPage(resolvedTotal);
      }
    } finally {
      if (gen === fetchGenRef.current) {
        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [userId]);

  // Keep loading pages until the list is scrollable or we run out of pages.
  const fillViewport = React.useCallback(() => {
    const el = listRef.current;
    if (!el || !openRef.current) return;
    if (fetchingRef.current || loadingMoreRef.current) return;
    if (pageRef.current >= totalPageRef.current) return;
    if (el.scrollHeight <= el.clientHeight + 12) {
      void loadMore();
    }
  }, [loadMore]);

  React.useEffect(() => {
    if (!open) return;
    // Wait a frame so the dropdown portal + max-height are laid out.
    const id = requestAnimationFrame(() => fillViewport());
    return () => cancelAnimationFrame(id);
  }, [open, notifications.length, page, totalPage, isFetching, isLoadingMore, fillViewport]);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      void loadMore();
    }
  }

  // Initial badge/list sync on mount.
  React.useEffect(() => {
    void syncFromServer({ quiet: true });
  }, [syncFromServer]);

  // Socket — always refresh badge + list in the background (even when closed).
  React.useEffect(() => {
    if (!userId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://10.10.26.173:5003";

    if (!socketUrl) return;

    const token = Cookies.get("accessToken");
    const socket: Socket = io(socketUrl, {
      transports: ["websocket"],
      auth: token ? { token } : undefined,
    });

    const eventName = `get-notification::${userId}`;
    const onNotify = () => {
      // Quiet sync so the bell badge updates without opening the menu.
      void syncRef.current({ quiet: true });
    };

    socket.on(eventName, onNotify);
    socket.on("connect_error", (err) => {
      console.warn("Notification socket error:", err.message);
    });

    return () => {
      socket.off(eventName, onNotify);
      socket.disconnect();
    };
  }, [userId]);

  function handleOpenChange(next: boolean) {
    openRef.current = next;
    setOpen(next);
    if (next) {
      // Fresh list when the user opens the panel.
      void syncFromServer({ quiet: true });
    }
  }

  const handleRead = async (notification: NotificationItem) => {
    if (!notification.seen) {
      const previous = notifications;
      const previousUnread = unreadCount;
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id ? { ...item, seen: true } : item,
        ),
      );
      setUnreadCount((current) => Math.max(0, current - 1));

      const res = await readNotificationAction(notification._id);
      if (!res.success) {
        setNotifications(previous);
        setUnreadCount(previousUnread);
        toast.error(res.message || "Failed to update notification.", {
          id: "notifications",
        });
        return;
      }
    }

    const href = resolveNotificationPath(notification.path);
    if (href) {
      handleOpenChange(false);
      router.push(href);
    }
  };

  const handleReadAll = async () => {
    if (!notifications.length || unreadCount === 0) return;

    const previous = notifications;
    const previousUnread = unreadCount;
    setNotifications((current) =>
      current.map((item) => ({ ...item, seen: true })),
    );
    setUnreadCount(0);

    const res = await readAllNotificationsAction();
    if (!res.success) {
      setNotifications(previous);
      setUnreadCount(previousUnread);
      toast.error(res.message || "Failed to update notifications.", {
        id: "notifications",
      });
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className={cn(
            "relative grid h-10 w-10 place-items-center rounded-full border border-hairline bg-white/3 text-mist transition-colors hover:bg-white/[0.07] hover:text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/40",
            className,
          )}
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-gradient px-1 text-[10px] font-semibold leading-none text-white shadow-lg">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-80 overflow-hidden rounded-2xl border-hairline-strong bg-[#1a1a28]/95 p-0 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:w-96"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3.5">
          <DropdownMenuLabel className="flex items-center gap-2 p-0 text-sm font-semibold text-cloud">
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-md border border-violet/30 bg-violet/15 px-1.5 py-0.5 text-[10px] font-semibold text-violet-bright">
                {unreadCount} new
              </span>
            )}
          </DropdownMenuLabel>

          {notifications.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleReadAll()}
              disabled={isFetching || unreadCount === 0}
              className="h-8 gap-1 rounded-lg px-2 text-xs font-medium text-mist hover:bg-white/5 hover:text-cloud disabled:opacity-40"
            >
              <Check className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="m-0 bg-hairline" />

        <div
          ref={listRef}
          onScroll={handleScroll}
          className="max-h-104 divide-y divide-hairline overflow-y-auto overscroll-contain"
        >
          {isFetching && notifications.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-4 py-12 text-sm text-mist">
              <Loader2 className="h-4 w-4 animate-spin text-violet-bright" />
              Loading…
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-hairline bg-white/3 text-faint">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-cloud">All caught up</p>
              <p className="mt-1 text-xs text-mist">
                You have no notifications yet.
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  className={cn(
                    "group relative block w-full px-4 py-3.5 text-left transition-colors hover:bg-white/4",
                    !notification.seen && "bg-violet/4",
                  )}
                  onClick={() => void handleRead(notification)}
                >
                  {!notification.seen && (
                    <span className="absolute bottom-0 left-0 top-0 w-0.5 rounded-r-md bg-violet-bright" />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors",
                        notification.seen
                          ? "border-hairline bg-white/3 text-faint"
                          : "border-violet/30 bg-violet/15 text-violet-bright",
                      )}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-xs tracking-wide",
                            notification.seen
                              ? "font-medium text-mist"
                              : "font-semibold text-cloud",
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.seen && (
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-bright shadow-[0_0_8px_rgba(129,49,240,0.6)]" />
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-mist transition-colors group-hover:text-cloud/80">
                        {notification.message}
                      </p>
                      {notification.createdAt && (
                        <p className="mt-1 text-[11px] text-faint">
                          {relativeTime(notification.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {isLoadingMore && (
                <div className="flex items-center justify-center gap-2 py-3 text-xs text-mist">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading more…
                </div>
              )}

              {hasMore && !isLoadingMore && (
                <div className="p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-mist hover:text-cloud"
                    onClick={() => void loadMore()}
                  >
                    Load more
                  </Button>
                </div>
              )}

              {!hasMore && notifications.length > 0 && (
                <p className="py-3 text-center text-[11px] text-faint">
                  No more notifications
                </p>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
