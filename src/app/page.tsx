import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { WhyHubology } from "@/components/sections/why-hubology";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, buildMetadata, getSiteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hubology — Launch, grow, and scale your business",
  absoluteTitle: true,
  description:
    "Hubology helps founders launch, grow, and scale with verified business experts, consulting services, a private community forum, digital books, and membership perks — all in one platform.",
  path: "/",
  keywords: [
    "all-in-one business platform",
    "launch grow scale business",
    "founder tools and resources",
    "hire business consultant online",
    "startup growth community",
    "verified experts for entrepreneurs",
  ],
});

export default function HomePage() {
  const site = getSiteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${site}/#organization`,
              name: SITE_NAME,
              url: site,
              logo: absoluteUrl("/logo-hubology.svg"),
              description:
                "All-in-one digital workspace for founders to access verified experts, services, community, and growth resources.",
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": `${site}/#website`,
              url: site,
              name: SITE_NAME,
              publisher: { "@id": `${site}/#organization` },
              potentialAction: {
                "@type": "SearchAction",
                target: `${site}/vendors?searchTerm={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }}
      />
      <Hero />
      <WhyHubology />
      <Testimonials />
      <CtaBand />
    </>
  );
}
