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
  fullName: z.string().min(2, "Please enter your full name"),
  jobTitle: z.string().min(2, "Please enter your job title"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  contactNo: z
    .string()
    .min(6, "Enter a valid contact number")
    .regex(/^[+()\-\s\d]+$/, "Enter a valid contact number"),
  company: z.string().min(2, "Please enter your company or organization"),
  expertise: z.string().min(1, "Select your primary area of expertise"),
  bio: z
    .string()
    .min(40, "Tell members a bit more — at least 40 characters")
    .max(600, "Please keep your bio under 600 characters"),
  agree: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
});

export type ExpertRegisterValues = z.infer<typeof expertRegisterSchema>;

/** Areas of interest / expertise, derived from the service catalog. */
export const expertiseOptions = [
  "Corporation & Formation",
  "Tax Strategy",
  "Legal Counsel",
  "Brand Strategy",
  "Growth Marketing",
  "Fundraising",
] as const;
