import { z } from "zod";

/* ----------------------------- Login ----------------------------- */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;

/* ----------------- Member registration (shorter) ----------------- */
export const memberRegisterSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  company: z.string().optional(),
  interest: z.string().min(1, "Select an area of interest"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agree: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
});

export type MemberRegisterValues = z.infer<typeof memberRegisterSchema>;

/* ----------------- Expert registration (full) ------------------- */
export const expertRegisterSchema = z.object({
  // Step 1 — identity
  fullName: z.string().min(2, "Please enter your full name"),
  jobTitle: z.string().min(2, "Please enter your job title"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  contactNo: z
    .string()
    .min(6, "Enter a valid contact number")
    .regex(/^[+()\-\s\d]+$/, "Enter a valid contact number"),
  company: z.string().min(2, "Please enter your company or organization"),
  bio: z
    .string()
    .min(40, "Tell members a bit more — at least 40 characters")
    .max(600, "Please keep your bio under 600 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),

  // Step 2 — expertise & experience
  expertise: z
    .array(z.string())
    .min(1, "Select at least one area of expertise")
    .max(6, "Pick up to 6 areas so your profile stays focused"),
  yearsExperience: z.string().min(1, "Select your years of experience"),
  degree: z.string().max(80, "Please keep this short").optional().or(z.literal("")),
  linkedin: z
    .string()
    .trim()
    .refine(
      (v) => !v || /(^https?:\/\/)?([\w-]+\.)*linkedin\.com\/.+/i.test(v),
      "Enter a valid LinkedIn profile URL",
    )
    .optional()
    .or(z.literal("")),

  // Step 3 — consulting preferences
  hourlyRate: z.string().min(1, "Select an hourly rate range"),
  availability: z.string().min(1, "Select your availability"),
  consultationTypes: z
    .array(z.string())
    .min(1, "Select at least one consultation type"),

  agree: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ExpertRegisterValues = z.infer<typeof expertRegisterSchema>;

/* ------------------- Service booking (intake) ------------------- */
export const bookingSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  date: z
    .string()
    .min(1, "Choose a preferred date")
    .refine(
      (v) => v >= new Date().toISOString().slice(0, 10),
      "Choose a date in the future",
    ),
  time: z.string().min(1, "Choose a preferred time"),
  notes: z
    .string()
    .min(10, "A sentence or two helps your expert prepare")
    .max(500, "Please keep this under 500 characters"),
});

export type BookingValues = z.infer<typeof bookingSchema>;

/**
 * Areas of interest / expertise. Combines the service-catalog areas
 * with broader consulting disciplines so the searchable multi-select
 * covers most experts. Reused by the member "interest" select too.
 */
export const expertiseOptions = [
  "Corporation & Formation",
  "Tax Strategy",
  "Legal Counsel",
  "Brand Strategy",
  "Growth Marketing",
  "Fundraising",
  "Finance & Accounting",
  "Operations",
  "Technology & Product",
  "Sales",
  "Human Resources",
  "Data & Analytics",
] as const;

/** Experience bands for the expert application. */
export const yearsExperienceOptions = [
  "Less than 2 years",
  "2 - 5 years",
  "6 - 10 years",
  "11 - 15 years",
  "15 - 20 years",
  "20+ years",
] as const;

/** Hourly rate ranges (USD). */
export const hourlyRateOptions = [
  "$50 - $100",
  "$100 - $250",
  "$250 - $500",
  "$500 - $1000",
  "$1000+",
] as const;

/** Weekly availability commitments. */
export const availabilityOptions = [
  "Part-time (5-15 hrs/week)",
  "Full-time (40+ hrs/week)",
  "Project-based",
  "Weekends only",
  "Limited / by request",
] as const;

/** Ways an expert is willing to consult. */
export const consultationTypeOptions = [
  "1-on-1 Calls",
  "Document Review",
  "Long-term Projects",
  "Async Q&A",
  "Workshops & Training",
] as const;
