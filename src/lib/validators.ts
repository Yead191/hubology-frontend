import { z } from "zod";

/* ----------------------------- Login ----------------------------- */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;

/* ------------------------- Forgot password ------------------------ */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/* ------------------------- Reset password ------------------------- */
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

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
  photo: z.string().min(1, "Please upload your photo"),
  contactNo: z
    .string()
    .min(6, "Enter a valid contact number")
    .regex(/^[+()\-\s\d]+$/, "Enter a valid contact number"),
  company: z.string().min(2, "Please enter your company or organization"),
  bio: z
    .string()
    .min(10, "Tell members a bit more — at least 40 characters")
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
  hourlyRate: z
    .string()
    .min(1, "Enter your hourly rate")
    .refine((v) => Number(v) > 0, "Enter a valid hourly rate"),
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
// Name/email come from the authenticated token on the backend, so we only
// collect scheduling + phone here.
export const bookingSchema = z.object({
  date: z
    .string()
    .min(1, "Choose a preferred date")
    .refine(
      (v) => v >= new Date().toISOString().slice(0, 10),
      "Choose a date in the future",
    ),
  time: z
    .string()
    .min(1, "Choose a preferred time")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a preferred time"),
  phone: z
    .string()
    .min(6, "Enter a valid contact number")
    .regex(/^[+()\-\s\d]+$/, "Enter a valid contact number"),
  note: z
    .string()
    .max(500, "Please keep this under 500 characters")
    .optional()
    .or(z.literal("")),
  coupon: z
    .string()
    .max(64, "Coupon code is too long")
    .optional()
    .or(z.literal("")),
});

export type BookingValues = z.infer<typeof bookingSchema>;

/**
 * Areas of interest / expertise. Combines the service-catalog areas
 * with broader consulting disciplines so the searchable multi-select
 * covers most experts. Reused by the member "interest" select too.
 */
export const expertiseOptions = [
  "Business Consultant",
  "Corporation & Formation",
  "Tax Strategy",
  "Legal Counsel",
  "Brand Strategy",
  "Growth Marketing",
  "Fundraising",
  "Finance & Accounting",
  "Operations",
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

/** Hourly rate ranges (USD) — `key` is the API `hourlyRateRange` query value (e.g. 50-120). */
export const hourlyRateOptions = [
  { key: "50-120", value: "$50 - $120" },
  { key: "120-250", value: "$120 - $250" },
  { key: "250-500", value: "$250 - $500" },
  { key: "500-1000", value: "$500 - $1000" },
  { key: "1000+", value: "$1000+" },
] as const;

export const availabilityOptions = [
  { key: "Part Time", value: "Part-time (5-15 hrs/week)" },
  { key: "Full Time", value: "Full-time (40+ hrs/week)" },
  { key: "Project Based", value: "Project-based" },
  { key: "Weekends Only", value: "Weekends only" },
  { key: "Limited", value: "Limited / by request" },
] as const;

/** Ways an expert is willing to consult. */
export const consultationTypeOptions = [
  "1-on-1 Calls",
  "Document Review",
  "Long-term Projects",
  "Async Q&A",
  "Workshops & Training",
] as const;

/** Translates availability key code (e.g. 'Part Time') to visible label text. */
export function getAvailabilityLabel(key: string): string {
  const opt = availabilityOptions.find((o) => o.key === key);
  return opt ? opt.value : key;
}
