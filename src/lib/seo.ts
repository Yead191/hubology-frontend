import type { Metadata } from "next";

/** Production site origin. Override with NEXT_PUBLIC_SITE_URL. */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://thehubology.com";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Prefer a 1200×630 PNG at this path when available; logo is the safe fallback. */
const DEFAULT_OG_IMAGE = "/logo-hubology.svg";

export const SITE_NAME = "Hubology";

export const DEFAULT_KEYWORDS = [
  "Hubology",
  "the hubology",
  "thehubology",
  "business growth platform",
  "verified business experts",
  "founder community",
  "entrepreneur marketplace",
  "business consulting",
  "startup services",
  "company formation",
  "tax strategy for founders",
  "expert directory",
] as const;

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string | null;
  /** When true, search engines should not index the page. */
  noIndex?: boolean;
  /** Use a fully absolute title (skips the root "%s · Hubology" template). */
  absoluteTitle?: boolean;
};

/**
 * Consistent title / description / canonical / Open Graph / Twitter metadata
 * for Hubology public pages.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image,
  noIndex = false,
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl(DEFAULT_OG_IMAGE);

  const mergedKeywords = Array.from(
    new Set([...keywords, ...DEFAULT_KEYWORDS].filter(Boolean)),
  );

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: absoluteTitle ? title : `${title} · ${SITE_NAME}`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} · ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : { index: true, follow: true },
  };
}

export function noIndexMetadata(title: string, description?: string): Metadata {
  return buildMetadata({
    title,
    description:
      description || "Private Hubology page. Sign in to access your account.",
    noIndex: true,
    keywords: [],
  });
}
