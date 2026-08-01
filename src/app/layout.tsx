import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import NavServer from "@/components/layout/NavServer";
import {
  DEFAULT_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/seo";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Launch, grow, and scale your business`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Hubology is the all-in-one platform for founders: verified business experts, growth services, a member community forum, digital books, and tools to launch, grow, and scale.",
  keywords: [...DEFAULT_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Launch, grow, and scale your business`,
    description:
      "Access verified experts, founder services, membership community, and growth resources in one digital workspace.",
    images: [
      {
        url: absoluteUrl("/logo-hubology.svg"),
        width: 1200,
        height: 630,
        alt: "Hubology — business growth platform for founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Launch, grow, and scale your business`,
    description:
      "Verified experts, services, community forum, and founder resources — all in one place.",
    images: [absoluteUrl("/logo-hubology.svg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-ink text-cloud antialiased scroll-smooth">
        <Toaster
          theme="dark"
          position="bottom-right"
          duration={2000}
          closeButton
          gap={10}
          toastOptions={{
            classNames: {
              toast:
                "group !font-sans !rounded-xl !border !border-hairline-strong !bg-panel-soft/95 !text-cloud !backdrop-blur-xl !shadow-[0_24px_60px_-28px_rgba(129,49,240,0.55)]",
              title: "!text-cloud !font-semibold !text-sm",
              description: "!text-mist !text-[13px]",
              actionButton:
                "!bg-brand-gradient !text-white !rounded-full !text-xs !font-semibold",
              cancelButton:
                "!bg-white/10 !text-cloud !rounded-full !text-xs hover:!bg-white/15",
              closeButton:
                "!bg-panel-soft !border-hairline-strong !text-mist hover:!text-cloud hover:!bg-panel",
              success: "[&_[data-icon]]:!text-emerald-400",
              error: "[&_[data-icon]]:!text-destructive",
              warning: "[&_[data-icon]]:!text-amber-400",
              info: "[&_[data-icon]]:!text-violet-bright",
              loader: "!text-violet-bright",
            },
          }}
        />

        <NavServer />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
