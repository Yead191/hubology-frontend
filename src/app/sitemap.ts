import type { MetadataRoute } from "next";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { absoluteUrl } from "@/lib/seo";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/vendors", changeFrequency: "daily", priority: 0.9 },
  { path: "/store", changeFrequency: "weekly", priority: 0.85 },
  { path: "/office-supplies", changeFrequency: "weekly", priority: 0.8 },
  { path: "/membership", changeFrequency: "monthly", priority: 0.85 },
  { path: "/membership/vendor", changeFrequency: "monthly", priority: 0.85 },
  { path: "/forum", changeFrequency: "daily", priority: 0.75 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/join", changeFrequency: "monthly", priority: 0.8 },
  { path: "/register/member", changeFrequency: "monthly", priority: 0.65 },
  { path: "/register/expert", changeFrequency: "monthly", priority: 0.65 },
  { path: "/ifundayiti", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
  { path: "/vendor-terms", changeFrequency: "yearly", priority: 0.3 },
];

async function fetchIds(
  url: string,
): Promise<{ id: string; updatedAt?: string }[]> {
  const res = await nextFetch<{ _id: string; updatedAt?: string }[]>(url, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.success || !Array.isArray(res.data)) return [];
  return res.data
    .filter((item) => item?._id)
    .map((item) => ({ id: item._id, updatedAt: item.updatedAt }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [services, vendors, digital, office] = await Promise.all([
    fetchIds("/services?page=1&limit=100").catch(() => []),
    fetchIds("/vendor?page=1&limit=100").catch(() => []),
    fetchIds("/books?type=digital&page=1&limit=100").catch(() => []),
    fetchIds("/books?type=office&page=1&limit=100").catch(() => []),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.id}`),
      lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...vendors.map((v) => ({
      url: absoluteUrl(`/vendors/${v.id}`),
      lastModified: v.updatedAt ? new Date(v.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...digital.map((b) => ({
      url: absoluteUrl(`/store/${b.id}`),
      lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...office.map((b) => ({
      url: absoluteUrl(`/office-supplies/${b.id}`),
      lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
