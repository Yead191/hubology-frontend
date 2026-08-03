"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { PROJECT_BUDGETS, type ProjectBudget } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

const BUDGET_OPTIONS: { value: ProjectBudget; label: string }[] = [
  { value: "UNDER_100", label: "Under $100" },
  { value: "100_300", label: "$100 – $300" },
  { value: "300_500", label: "$300 – $500" },
  { value: "600_1000", label: "$600 – $1,000" },
  { value: "ABOVE_1000", label: "Above $1,000" },
];

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  projectDescription: z.string().min(5, "Project description is required"),
  budget: z.enum(PROJECT_BUDGETS),
});

type ContactFormData = z.infer<typeof contactSchema>;

const EMPTY_FORM: {
  name: string;
  email: string;
  projectDescription: string;
  budget: ProjectBudget | "";
} = {
  name: "",
  email: "",
  projectDescription: "",
  budget: "",
};

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(contactSchema.safeParse(formData).success);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(
        parsed.error.errors[0]?.message || "Please complete the form.",
        { id: "inquiry" },
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ContactFormData = {
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim(),
        projectDescription: parsed.data.projectDescription.trim(),
        budget: parsed.data.budget,
      };

      const res = await nextFetch("/inquiry", {
        method: "POST",
        body: payload,
      });

      if (!res.success) {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "inquiry" });
          });
        } else {
          toast.error(res.message || "Could not send your inquiry.", {
            id: "inquiry",
          });
        }
        return;
      }

      toast.success(res.message || "Inquiry sent successfully.", {
        id: "inquiry",
      });
      setIsSubmitted(true);
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error("Inquiry error:", err);
      toast.error("Network error. Please try again.", { id: "inquiry" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const getCircleClasses = (fieldName: string) => {
    const isActive = activeField === fieldName;
    return `group relative flex aspect-square w-full max-w-[220px] flex-col items-center justify-center rounded-full border backdrop-blur-md transition-all duration-500 shrink-0
      ${
        isActive
          ? "border-violet-bright/30 bg-brand-gradient glow-violet z-50 scale-105 shadow-[0_0_80px_-15px_rgba(154,85,255,0.7)]"
          : "border-hairline-strong bg-panel/30 hover:bg-panel/50 hover:scale-[1.02]"
      }`;
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden pt-32 pb-24">
      <Aurora
        animated
        className="absolute top-1/2 left-1/2 h-200 w-300 -translate-x-1/2 -translate-y-1/2 opacity-20"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-16 text-center lg:mb-24">
            <h1 className="font-display text-4xl font-bold tracking-tight text-cloud sm:text-5xl md:text-6xl">
              Let&apos;s create something <br className="hidden sm:block" />
              <span className="text-gradient">extraordinary.</span>
            </h1>
            <p className="mt-6 text-lg text-mist">
              Tell us about your project and we&apos;ll get back to you shortly.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          {isSubmitted ? (
            <div className="mx-auto flex max-w-2xl animate-in flex-col items-center justify-center text-center duration-700 fade-in zoom-in">
              <div className="relative mb-8 flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-brand-gradient glow-violet">
                <CheckCircle2 className="h-16 w-16 text-white" />
              </div>
              <h2 className="mb-4 font-display text-3xl font-bold text-cloud">
                Message sent successfully!
              </h2>
              <p className="text-lg text-mist">
                Thank you for reaching out. Our team will review your request
                and get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-10 rounded-full border border-hairline-strong bg-white/5 px-8 py-3 font-medium text-cloud transition-all hover:bg-white/10"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => void handleSubmit(e)}
              className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-0"
            >
              <div className={`${getCircleClasses("name")} z-1`}>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-transparent px-6 py-4 text-center text-base font-medium text-cloud transition-colors placeholder:text-mist focus:outline-none focus:placeholder:text-cloud/70 lg:text-lg"
                />
              </div>

              <div className={`${getCircleClasses("email")} z-2`}>
                <input
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-transparent px-6 py-4 text-center text-base font-medium text-cloud transition-colors placeholder:text-mist focus:outline-none focus:placeholder:text-cloud/70 lg:text-lg"
                />
              </div>

              <div className={`${getCircleClasses("projectDescription")} z-3`}>
                <input
                  required
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  onFocus={() => setActiveField("projectDescription")}
                  onBlur={() => setActiveField(null)}
                  type="text"
                  placeholder="Your project is about"
                  className="w-full bg-transparent px-6 py-4 text-center text-base font-medium text-cloud transition-colors placeholder:text-mist focus:outline-none focus:placeholder:text-cloud/70 lg:text-lg"
                />
              </div>

              <div className={`${getCircleClasses("budget")} z-4`}>
                <select
                  required
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  onFocus={() => setActiveField("budget")}
                  onBlur={() => setActiveField(null)}
                  className="w-full cursor-pointer appearance-none bg-transparent px-6 py-4 text-center text-base font-medium text-mist transition-colors focus:text-cloud focus:outline-none lg:text-lg"
                >
                  <option value="" disabled className="bg-ink text-mist">
                    Project budget
                  </option>
                  {BUDGET_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-ink text-cloud"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 opacity-50 transition-opacity group-hover:opacity-100 lg:right-16">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`group relative z-5 flex aspect-square w-full max-w-55 shrink-0 cursor-pointer flex-col items-center justify-center rounded-full backdrop-blur-md transition-all duration-500
                  ${
                    isValid
                      ? "border border-violet-bright/30 bg-brand-gradient glow-violet hover:z-50 hover:scale-105 hover:shadow-[0_0_80px_-15px_rgba(154,85,255,0.7)]"
                      : "cursor-not-allowed border border-hairline-strong bg-panel/30 text-mist hover:bg-panel/50"
                  }
                `}
              >
                <div
                  className={`flex items-center gap-2 text-base font-semibold transition-colors duration-500 lg:text-lg ${isValid ? "text-white" : "text-faint"}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <ArrowRight
                        className={`h-5 w-5 transition-transform duration-300 ${isValid ? "group-hover:translate-x-1" : ""}`}
                      />
                    </>
                  )}
                </div>
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </main>
  );
}
