"use server";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  path?: string;
  refId?: string;
  seen: boolean;
  sender?: { _id: string; name?: string; image?: string } | null;
  receiver?: { _id: string } | string | null;
  createdAt: string;
  updatedAt?: string;
}

/** Nested shape returned by GET /notification. */
export interface NotificationsPayload {
  unreadCount: number;
  data: NotificationItem[];
}

export async function getNotificationsAction(page = 1, limit = 10) {
  return nextFetch<NotificationsPayload>(
    `/notification?page=${page}&limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
      tags: ["notification"],
    },
  );
}

export async function readNotificationAction(id: string) {
  return nextFetch(`/notification/${id}`, {
    method: "PATCH",
  });
}

export async function readAllNotificationsAction() {
  return nextFetch("/notification", {
    method: "PATCH",
  });
}
