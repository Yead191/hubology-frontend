"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockNotifications = [
  {
    id: 1,
    title: "New reply from Sarah Whitfield",
    body: "Re: your growth funnel question",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Session confirmed",
    body: "Tax strategy call with Dr. Helena Thorne",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Your expert profile was approved",
    body: "You are now visible in the directory",
    time: "Yesterday",
    unread: false,
  },
];

export function NotificationMenu() {
  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-hairline bg-white/[0.03] text-mist transition-colors hover:text-cloud hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/40"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-violet-bright opacity-75" />
              <span className="h-2 w-2 rounded-full bg-violet-bright" />
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between text-sm text-cloud">
          <span className="font-semibold">Notifications</span>
          <span className="text-xs text-violet-bright">{unreadCount} new</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-0.5">
          {mockNotifications.map((n) => (
            <button
              key={n.id}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  n.unread ? "bg-violet-bright" : "bg-transparent"
                }`}
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-cloud">{n.title}</span>
                <span className="text-xs text-mist">{n.body}</span>
                <span className="text-[11px] text-faint">{n.time}</span>
              </span>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
