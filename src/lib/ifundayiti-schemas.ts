import { z } from "zod";

/* ----------------- IFundAyiti Personal Details Schema ----------------- */
export const personalSchema = z.object({
  name: z.string().min(2, "Full Name must match your National ID"),
  dob: z.string().min(1, "Date of Birth is required"),
  nationality: z.string().min(1, "Nationality is required").default("Haitian"),
  location: z.string().min(5, "Full Address is required"),
});

export type PersonalValues = z.infer<typeof personalSchema>;

/* ----------------- IFundAyiti Contact Information Schema --------------- */
export const contactSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(8, "Enter a valid phone number"),
});

export type ContactValues = z.infer<typeof contactSchema>;

/* ----------------- IFundAyiti Identification Schema -------------------- */
export const idSchema = z.object({
  nationalId: z.string().min(10, "National ID Number is required"),
  passport: z.string().optional().or(z.literal("")),
});

export type IdValues = z.infer<typeof idSchema>;

/* ----------------- IFundAyiti Grant Details Schema --------------------- */
export const grantSchema = z.object({
  projectName: z.string().min(3, "Project Name is required"),
  projectDescription: z.string().min(15, "Please provide a detailed description (min 15 chars)"),
  requestedAmount: z
    .number({ invalid_type_error: "Requested amount must be a number" })
    .min(50, "Minimum request is $50")
    .max(1000, "Maximum grant request is $1,000"),
  fundUsage: z.string().min(15, "Explain how the fund will be utilized"),
  expectedImpact: z.string().min(15, "Explain the expected community impact"),
});

export type GrantValues = z.infer<typeof grantSchema>;

/* ----------------- IFundAyiti Financial Background Schema -------------- */
export const backgroundSchema = z.object({
  occupation: z.string().min(2, "Current occupation is required"),
  financialBackground: z.string().min(15, "Brief financial background is required"),
});

export type BackgroundValues = z.infer<typeof backgroundSchema>;

/* ----------------- IFundAyiti Agreement Schema ------------------------ */
export const agreementSchema = z.object({
  certifyAccurate: z.literal(true, {
    errorMap: () => ({ message: "You must certify accuracy of details" }),
  }),
  noGuarantee: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge funding is not guaranteed" }),
  }),
  disqualification: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge falsification terms" }),
  }),
});

export type AgreementValues = z.infer<typeof agreementSchema>;
