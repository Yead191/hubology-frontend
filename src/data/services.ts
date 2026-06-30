import type { ServiceDetail, ServicePackage } from "@/types";

/* ------------------------------------------------------------------ *
 * Service packages — shown on the Services index as pricing cards.
 * ------------------------------------------------------------------ */
export const servicePackages: ServicePackage[] = [
  {
    slug: "ein",
    title: "EIN",
    tagline: "Get your EIN hassle-free with verified tax experts.",
    price: { currency: "$", amount: 29, frequency: "per session" },
    features: [
      "Fast EIN application",
      "IRS-compliant filing",
      "Expert guidance",
    ],
  },
  {
    slug: "llc",
    title: "LLC",
    tagline: "Get your LLC formed by verified experts — fast and reliable.",
    price: { currency: "$", amount: 120, frequency: "per session" },
    features: [
      "State filing included",
      "Operating agreement guidance",
      "Formation support",
    ],
  },
  {
    slug: "corporation",
    title: "Corporation",
    tagline: "Form your company the right way, fast.",
    price: { currency: "$", amount: 59, frequency: "per session" },
    features: [
      "Corporation filing",
      "Corporate compliance",
      "Official documentation",
    ],
    featured: true,
  },
  {
    slug: "bookkeeping",
    title: "Bookkeeping",
    tagline:
      "Professional bookkeeping services to keep your finances organized and accurate.",
    price: { currency: "$", amount: 99, frequency: "per session" },
    features: [
      "Monthly bookkeeping",
      "Expense tracking",
      "Financial reports",
    ],
  },
  {
    slug: "billing",
    title: "Billing",
    tagline:
      "Professional billing services to streamline your invoicing and accounts receivable.",
    price: { currency: "$", amount: 140, frequency: "per session" },
    features: [
      "Invoice management",
      "Payment tracking",
      "Accounts receivable",
    ],
  },
  {
    slug: "consultation",
    title: "Consultation",
    tagline: "Get expert guidance on business strategy and growth.",
    price: { currency: "$", amount: 160, frequency: "per session" },
    features: [
      "One-on-one consultation",
      "Business strategy",
      "Action plan",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Service detail content — the overview shown on /services/[slug].
 * ------------------------------------------------------------------ */
export const serviceDetails: Record<string, ServiceDetail> = {
  ein: {
    slug: "ein",
    title: "Employer Identification Number (EIN)",
    category: "Business Formation",
    overview:
      "Obtain your Employer Identification Number quickly and accurately with help from experienced professionals.",
    longDescription:
      "Whether you're starting a new business, opening a business bank account, or hiring employees, an EIN is essential. Our experts handle the application process efficiently, ensuring your registration is completed correctly and without unnecessary delays.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Fast IRS filing",
      "Accurate application",
      "Business registration support",
      "Expert assistance",
    ],
  },

  llc: {
    slug: "llc",
    title: "LLC Formation",
    category: "Business Formation",
    overview:
      "Launch your Limited Liability Company with confidence through our streamlined formation service.",
    longDescription:
      "We help entrepreneurs establish their LLC quickly while ensuring compliance with state regulations. From filing formation documents to providing guidance on operating agreements, our experts simplify the entire process.",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "State filing",
      "Operating agreement guidance",
      "Compliance support",
      "Professional filing assistance",
    ],
  },

  corporation: {
    slug: "corporation",
    title: "Corporation Formation",
    category: "Business Formation",
    overview:
      "Establish your corporation with expert guidance and ensure every legal requirement is handled correctly.",
    longDescription:
      "Starting a corporation involves more than paperwork. Our professionals assist with incorporation documents, compliance requirements, and organizational setup so your business starts on the right foundation.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Articles of incorporation",
      "Corporate compliance",
      "Official documentation",
      "Formation guidance",
    ],
  },

  bookkeeping: {
    slug: "bookkeeping",
    title: "Bookkeeping Services",
    category: "Accounting",
    overview:
      "Keep your financial records accurate, organized, and up-to-date with professional bookkeeping services.",
    longDescription:
      "Our bookkeeping specialists manage your daily financial transactions, organize expenses, reconcile accounts, and generate reports that help you make informed business decisions.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Monthly bookkeeping",
      "Bank reconciliation",
      "Expense tracking",
      "Financial reporting",
    ],
  },

  billing: {
    slug: "billing",
    title: "Billing Services",
    category: "Financial Management",
    overview:
      "Simplify your invoicing and payment collection with efficient billing solutions tailored to your business.",
    longDescription:
      "We help businesses manage invoices, track payments, follow up on outstanding balances, and maintain organized billing records, improving cash flow and reducing administrative work.",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Invoice generation",
      "Payment tracking",
      "Accounts receivable",
      "Billing management",
    ],
  },

  consultation: {
    slug: "consultation",
    title: "Business Consultation",
    category: "Business Advisory",
    overview:
      "Receive personalized advice from experienced professionals to help your business grow and succeed.",
    longDescription:
      "Whether you're launching a startup, expanding operations, or solving business challenges, our consultants provide practical recommendations and actionable strategies tailored to your goals.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Business strategy",
      "Growth planning",
      "One-on-one consultation",
      "Actionable recommendations",
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
