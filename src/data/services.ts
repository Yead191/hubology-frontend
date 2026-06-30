import type { ServiceDetail, ServicePackage } from "@/types";

/* ------------------------------------------------------------------ *
 * Service packages — shown on the Services index as pricing cards.
 * ------------------------------------------------------------------ */
export const servicePackages: ServicePackage[] = [
  {
    slug: "corporation",
    title: "Corporation",
    tagline: "Form your company the right way, fast.",
    price: { currency: "$", amount: 59, frequency: "per session" },
    features: [
      "Completed EIN application",
      "Official documentation",
      "100% accuracy guarantee",
    ],
  },
  {
    slug: "tax-strategy",
    title: "Tax Strategy",
    tagline: "Keep more of what you earn, legally.",
    price: { currency: "$", amount: 89, frequency: "per session" },
    features: [
      "Personalized tax planning",
      "Deduction & credit review",
      "Quarterly filing roadmap",
    ],
    featured: true,
  },
  {
    slug: "brand-strategy",
    title: "Brand Strategy",
    tagline: "Build a brand people remember.",
    price: { currency: "$", amount: 120, frequency: "per session" },
    features: [
      "Positioning & messaging audit",
      "Visual identity direction",
      "Go-to-market playbook",
    ],
  },
  {
    slug: "growth-marketing",
    title: "Growth Marketing",
    tagline: "Turn attention into revenue.",
    price: { currency: "$", amount: 99, frequency: "per session" },
    features: [
      "Channel & funnel teardown",
      "Paid + organic growth plan",
      "Conversion optimization",
    ],
  },
  {
    slug: "legal-counsel",
    title: "Legal Counsel",
    tagline: "Contracts and compliance, handled.",
    price: { currency: "$", amount: 140, frequency: "per session" },
    features: [
      "Contract drafting & review",
      "Entity & IP protection",
      "Compliance health check",
    ],
  },
  {
    slug: "fundraising",
    title: "Fundraising",
    tagline: "Get investor-ready and raise with confidence.",
    price: { currency: "$", amount: 160, frequency: "per session" },
    features: [
      "Pitch deck & narrative review",
      "Financial model stress-test",
      "Investor intro strategy",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Service detail content — the overview shown on /services/[slug].
 * ------------------------------------------------------------------ */
export const serviceDetails: Record<string, ServiceDetail> = {
  corporation: {
    slug: "corporation",
    title: "Corporation Formation",
    category: "Legal & Formation",
    overview:
      "Stand up a compliant business entity without the guesswork. Our verified formation experts handle filings, EINs, and the paperwork that trips most founders up — so you can focus on building.",
    longDescription:
      "From choosing the right structure to filing your articles of incorporation and securing your EIN, the right advisor turns a confusing process into a single afternoon. Every expert on Hubology has been manually vetted for accuracy and reliability.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Entity selection guidance",
      "EIN & state filings",
      "Operating agreements",
      "Ongoing compliance",
    ],
  },
  "tax-strategy": {
    slug: "tax-strategy",
    title: "Tax Strategy",
    category: "Finance",
    overview:
      "Stop overpaying. Work with seasoned tax strategists who map out a plan tailored to your business so every dollar works harder for you.",
    longDescription:
      "Proactive tax planning is the difference between scrambling in April and keeping more of what you earn all year. Our experts review your structure, surface deductions you are missing, and build a quarterly roadmap you can actually follow.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Personalized planning",
      "Deduction discovery",
      "Quarterly roadmap",
      "Audit-ready records",
    ],
  },
  "brand-strategy": {
    slug: "brand-strategy",
    title: "Brand Strategy",
    category: "Marketing",
    overview:
      "Clarify who you are and why it matters. Our brand strategists sharpen your positioning, voice, and identity into something customers remember.",
    longDescription:
      "A strong brand compounds. Work with experts who audit your positioning, define your messaging, and hand you a go-to-market playbook your whole team can rally behind.",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Positioning audit",
      "Messaging framework",
      "Visual direction",
      "Launch playbook",
    ],
  },
  "growth-marketing": {
    slug: "growth-marketing",
    title: "Growth Marketing",
    category: "Marketing",
    overview:
      "Turn attention into revenue with operators who have scaled real businesses. Get a channel strategy and funnel built to convert.",
    longDescription:
      "Whether you are starting from zero or plateauing, our growth experts tear down your funnel, find the leaks, and build a paid-plus-organic plan tuned to your numbers.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Funnel teardown",
      "Channel strategy",
      "Conversion optimization",
      "Analytics setup",
    ],
  },
  "legal-counsel": {
    slug: "legal-counsel",
    title: "Legal Counsel",
    category: "Legal & Formation",
    overview:
      "Protect what you are building. Get contracts, IP, and compliance reviewed by experienced business attorneys before it costs you.",
    longDescription:
      "From your first contract to your next funding round, the right legal advisor keeps you protected. Our verified attorneys draft, review, and de-risk the agreements that matter.",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Contract drafting",
      "IP protection",
      "Entity structuring",
      "Compliance review",
    ],
  },
  fundraising: {
    slug: "fundraising",
    title: "Fundraising",
    category: "Finance",
    overview:
      "Walk into investor meetings prepared. Our fundraising experts pressure-test your story, your model, and your strategy.",
    longDescription:
      "Raising capital is a craft. Work with advisors who have sat on both sides of the table to refine your narrative, stress-test your model, and open the right doors.",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Deck & narrative",
      "Financial modeling",
      "Investor strategy",
      "Negotiation prep",
    ],
  },
};

/* ------------------------------ accessors ------------------------------ */

export function getServicePackages(): ServicePackage[] {
  return servicePackages;
}

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return serviceDetails[slug];
}

export function getServiceSlugs(): string[] {
  return servicePackages.map((p) => p.slug);
}
