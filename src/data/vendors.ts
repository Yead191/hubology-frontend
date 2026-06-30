import type { Vendor } from "@/types";

/* ------------------------------------------------------------------ *
 * Vendors / experts. Each is tied to a service via `serviceSlug`.
 * Contact details are intentionally exposed to logged-in members so
 * they can reach out directly — no payments handled on-platform.
 * ------------------------------------------------------------------ */
export const vendors: Vendor[] = [
  {
    id: "v-001",
    serviceSlug: "corporation",
    profile: "https://i.pravatar.cc/400?img=12",
    name: "AKM Ahsan Chowdhury",
    role: "Business Consultant",
    description:
      "Business consultancy services to help organisations improve their performance, from formation to scaling operations cleanly.",
    startingPrice: 240,
    rating: 4.9,
    reviews: 128,
    location: "Sydney, AU",
    contact: { email: "ahsanchowdhury12@gmail.com", phone: "+61 123 456 789" },
  },
  {
    id: "v-002",
    serviceSlug: "corporation",
    profile: "https://i.pravatar.cc/400?img=32",
    name: "Marcus Verlaine",
    role: "Formation Specialist",
    description:
      "15 years guiding founders through entity selection, EIN filings, and compliance so they launch on solid legal footing.",
    startingPrice: 180,
    rating: 4.8,
    reviews: 96,
    location: "Austin, US",
    contact: { email: "marcus.v@formationlab.co", phone: "+1 512 555 0142" },
  },
  {
    id: "v-003",
    serviceSlug: "tax-strategy",
    profile: "https://i.pravatar.cc/400?img=5",
    name: "Dr. Helena Thorne",
    role: "Tax Strategist",
    description:
      "Former Big Four advisor helping founders build proactive tax plans that protect margin and keep filings audit-ready.",
    startingPrice: 320,
    rating: 5.0,
    reviews: 211,
    location: "London, UK",
    contact: { email: "helena.thorne@thornetax.com", phone: "+44 20 7946 0958" },
  },
  {
    id: "v-004",
    serviceSlug: "tax-strategy",
    profile: "https://i.pravatar.cc/400?img=15",
    name: "Priya Nair",
    role: "CPA & Advisor",
    description:
      "CPA specializing in small-business tax planning, deduction discovery, and clean quarterly filing systems.",
    startingPrice: 210,
    rating: 4.9,
    reviews: 143,
    location: "Toronto, CA",
    contact: { email: "priya@nairadvisory.ca", phone: "+1 416 555 0188" },
  },
  {
    id: "v-005",
    serviceSlug: "brand-strategy",
    profile: "https://i.pravatar.cc/400?img=68",
    name: "Diego Alvarez",
    role: "Brand Strategist",
    description:
      "Built brands for 40+ startups. Sharpens positioning and identity into stories customers actually remember.",
    startingPrice: 260,
    rating: 4.8,
    reviews: 87,
    location: "Barcelona, ES",
    contact: { email: "diego@alvarezbrand.studio", phone: "+34 600 123 456" },
  },
  {
    id: "v-006",
    serviceSlug: "growth-marketing",
    profile: "https://i.pravatar.cc/400?img=51",
    name: "Sarah Whitfield",
    role: "Growth Lead",
    description:
      "Scaled three companies past 8 figures. Tears down funnels and builds paid-plus-organic plans tuned to your numbers.",
    startingPrice: 290,
    rating: 4.9,
    reviews: 174,
    location: "New York, US",
    contact: { email: "sarah@whitfieldgrowth.com", phone: "+1 212 555 0117" },
  },
  {
    id: "v-007",
    serviceSlug: "legal-counsel",
    profile: "https://i.pravatar.cc/400?img=60",
    name: "Jonathan Pierce",
    role: "Business Attorney",
    description:
      "Startup attorney covering contracts, IP, and compliance so founders stay protected through every stage.",
    startingPrice: 350,
    rating: 5.0,
    reviews: 102,
    location: "San Francisco, US",
    contact: { email: "jpierce@piercelegal.com", phone: "+1 415 555 0193" },
  },
  {
    id: "v-008",
    serviceSlug: "fundraising",
    profile: "https://i.pravatar.cc/400?img=47",
    name: "Amara Okafor",
    role: "Fundraising Advisor",
    description:
      "Ex-VC turned advisor. Refines your narrative, stress-tests your model, and opens the right investor doors.",
    startingPrice: 400,
    rating: 4.9,
    reviews: 119,
    location: "Singapore, SG",
    contact: { email: "amara@okaforcapital.com", phone: "+65 6123 4567" },
  },
];

/* ------------------------------ accessors ------------------------------ */

export function getVendorsByService(serviceSlug: string): Vendor[] {
  return vendors.filter((v) => v.serviceSlug === serviceSlug);
}

export function getAllVendors(): Vendor[] {
  return vendors;
}
