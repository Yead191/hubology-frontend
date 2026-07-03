"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  projectDetails: z.string().min(5, "Project details are required"),
  budget: z.enum(["under100", "100to300", "300to500"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: "",
    email: "",
    projectDetails: "",
    budget: undefined,
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkValidation = () => {
      const result = contactSchema.safeParse(formData);
      setIsValid(result.success);
    };
    checkValidation();
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

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
      {/* Background Ambience */}
      <Aurora
        animated
        className="absolute top-1/2 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 opacity-20"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-16 lg:mb-24">
            <h1 className="font-display text-4xl font-bold tracking-tight text-cloud sm:text-5xl md:text-6xl">
              Let's create something <br className="hidden sm:block" />
              <span className="text-gradient">extraordinary.</span>
            </h1>
            <p className="mt-6 text-lg text-mist">
              Tell us about your project and we'll get back to you shortly.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          {isSubmitted ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-brand-gradient glow-violet mb-8 shrink-0">
                <CheckCircle2 className="h-16 w-16 text-white" />
              </div>
              <h2 className="font-display text-3xl font-bold text-cloud mb-4">
                Message Sent Successfully!
              </h2>
              <p className="text-lg text-mist">
                Thank you for reaching out. Our team will review your request
                and get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    projectDetails: "",
                    budget: undefined,
                  });
                }}
                className="mt-10 rounded-full border border-hairline-strong bg-white/5 px-8 py-3 font-medium text-cloud transition-all hover:bg-white/10"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center lg:flex-row gap-4 lg:gap-0"
            >
              {/* Circle 1: Name */}
              <div className={getCircleClasses("name") + " z-1"}>
                <input
                  required
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-transparent px-6 py-4 text-center text-base lg:text-lg font-medium text-cloud placeholder:text-mist focus:outline-none focus:placeholder:text-cloud/70 transition-colors"
                />
              </div>

              {/* Circle 2: Email */}
              <div className={getCircleClasses("email") + " z-2"}>
                <input
                  required
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-transparent px-6 py-4 text-center text-base lg:text-lg font-medium text-cloud placeholder:text-mist focus:outline-none focus:placeholder:text-cloud/70 transition-colors"
                />
              </div>

              {/* Circle 3: Project Details */}
              <div className={getCircleClasses("projectDetails") + " z-3"}>
                <input
                  required
                  name="projectDetails"
                  value={formData.projectDetails || ""}
                  onChange={handleChange}
                  onFocus={() => setActiveField("projectDetails")}
                  onBlur={() => setActiveField(null)}
                  type="text"
                  placeholder="Your project is about"
                  className="w-full bg-transparent px-6 py-4 text-center text-base lg:text-lg font-medium text-cloud placeholder:text-mist focus:outline-none focus:placeholder:text-cloud/70 transition-colors"
                />
              </div>

              {/* Circle 4: Budget */}
              <div className={getCircleClasses("budget") + " z-4"}>
                <select
                  required
                  name="budget"
                  value={formData.budget || ""}
                  onChange={handleChange}
                  onFocus={() => setActiveField("budget")}
                  onBlur={() => setActiveField(null)}
                  className="w-full cursor-pointer appearance-none bg-transparent px-6 py-4 text-center text-base lg:text-lg font-medium text-mist focus:text-cloud focus:outline-none transition-colors"
                >
                  <option value="" disabled className="bg-ink text-mist">
                    Project budget
                  </option>
                  <option value="under100" className="bg-ink text-cloud">
                    Under 100
                  </option>
                  <option value="100to300" className="bg-ink text-cloud">
                    100 - 300
                  </option>
                  <option value="300to500" className="bg-ink text-cloud">
                    300 - 500
                  </option>
                </select>
                {/* Custom dropdown arrow to match the theme */}
                <div className="pointer-events-none absolute right-12 lg:right-16 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
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

              {/* Circle 5: Submit Button */}
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`group relative z-5 flex aspect-square w-full max-w-[220px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-full backdrop-blur-md transition-all duration-500
                  ${
                    isValid
                      ? "border border-violet-bright/30 bg-brand-gradient glow-violet hover:z-50 hover:scale-105 hover:shadow-[0_0_80px_-15px_rgba(154,85,255,0.7)]"
                      : "cursor-not-allowed border border-hairline-strong bg-panel/30 hover:bg-panel/50 text-mist"
                  }
                `}
              >
                <div
                  className={`flex items-center gap-2 text-base lg:text-lg font-semibold transition-colors duration-500 ${isValid ? "text-white" : "text-faint"}`}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
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
