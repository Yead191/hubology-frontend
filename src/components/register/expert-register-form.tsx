"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import {
  expertRegisterSchema,
  type ExpertRegisterValues,
} from "@/lib/validators";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Button } from "@/components/ui/button";
import { ExpertStepper, type StepMeta } from "./expert/expert-stepper";
import { StepIdentity } from "./expert/step-identity";
import { StepExpertise } from "./expert/step-expertise";
import { StepPreferences } from "./expert/step-preferences";

/** Fields validated before advancing past each step. */
const STEPS: (StepMeta & { fields: (keyof ExpertRegisterValues)[] })[] = [
  {
    id: "identity",
    label: "Your identity",
    fields: [
      "photo",
      "fullName",
      "jobTitle",
      "email",
      "contactNo",
      "company",
      "bio",
      "password",
      "confirmPassword",
    ],
  },
  {
    id: "expertise",
    label: "Expertise & experience",
    fields: ["expertise", "yearsExperience", "degree", "linkedin"],
  },
  {
    id: "preferences",
    label: "Consulting preferences",
    fields: ["hourlyRate", "availability", "consultationTypes", "agree"],
  },
];

export function ExpertRegisterForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const methods = useForm<ExpertRegisterValues>({
    resolver: zodResolver(expertRegisterSchema),
    mode: "onTouched",
    defaultValues: {
      photo: "",
      fullName: "",
      jobTitle: "",
      email: "",
      contactNo: "",
      company: "",
      bio: "",
      password: "",
      confirmPassword: "",
      expertise: [],
      yearsExperience: "",
      degree: "",
      linkedin: "",
      hourlyRate: "",
      availability: "",
      consultationTypes: [],
      agree: undefined,
    },
  });

  const {
    setValue,
    formState: { isSubmitting },
  } = methods;

  // Revoke object URLs to avoid memory leaks.
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setValue("photo", file.name, { shouldValidate: true, shouldDirty: true });
  }

  function clearPhoto() {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(null);
    setPreview(null);
    setValue("photo", "", { shouldValidate: true, shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const isLast = step === STEPS.length - 1;

  async function goNext() {
    const valid = await methods.trigger(STEPS[step].fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Submit as multipart FormData to the vendor endpoint. Vendor-specific
  // fields are nested under a JSON `vendorProfile`, with the photo as `image`.
  async function onValid(values: ExpertRegisterValues) {
    if (!photo) {
      toast.error("Please upload a profile photo.", { id: "vendor-register" });
      setStep(0);
      return;
    }

    try {
      const vendorProfile = {
        jobTitle: values.jobTitle,
        contactNo: values.contactNo,
        bio: values.bio,
        expertise: values.expertise,
        yearsExperience: values.yearsExperience,
        degree: values.degree,
        linkedin: values.linkedin,
        hourlyRate: Number(values.hourlyRate),
        availability: values.availability,
        consultationTypes: values.consultationTypes,
        applicationStatus: "pending",
      };

      const formData = new FormData();
      formData.append("name", values.fullName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("company", values.company);
      formData.append("vendorProfile", JSON.stringify(vendorProfile));
      formData.append("image", photo);

      const response = await nextFetch("/auth/register/vendor", {
        method: "POST",
        body: formData,
      });
      // console.log(response);
      if (response?.success) {
        toast.success(
          response?.message ||
            "Application submitted — verify your email to continue.",
        );
        router.push(
          `/verify-otp?email=${encodeURIComponent(values.email)}&flow=verify`,
        );
        return;
      }

      if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "vendor-register" });
        });
      } else {
        toast.error(response?.message || "Registration failed. Try again.", {
          id: "vendor-register",
        });
      }
    } catch (err) {
      console.error("Vendor registration error:", err);
      toast.error("Network error. Please try again.", {
        id: "vendor-register",
      });
    }
  }

  // Enter / submit only finalises on the last step; otherwise advance.
  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!isLast) {
      e.preventDefault();
      void goNext();
      return;
    }
    void methods.handleSubmit(onValid)(e);
  }

  return (
    <FormProvider {...methods}>
      <div className="mb-8">
        <ExpertStepper steps={STEPS} current={step} />
        {/* Mobile-only context, since the stepper hides labels on small screens. */}
        <p className="mt-4 text-sm font-medium text-cloud sm:hidden">
          Step {step + 1} of {STEPS.length}
          <span className="text-mist"> · {STEPS[step].label}</span>
        </p>
      </div>

      <form onSubmit={onFormSubmit} className="flex flex-col gap-6">
        {step === 0 && (
          <StepIdentity
            photo={{
              preview,
              onChange: handlePhoto,
              onClear: clearPhoto,
              inputRef: fileInputRef,
            }}
          />
        )}
        {step === 1 && <StepExpertise />}
        {step === 2 && <StepPreferences />}

        {/* Navigation — stacks full-width on mobile, primary action on top. */}
        <div className="flex flex-col-reverse gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {!isLast ? (
            <Button
              type="button"
              onClick={goNext}
              className="w-full sm:ml-auto sm:w-auto"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:ml-auto sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting
                  application…
                </>
              ) : (
                "Submit expert application"
              )}
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-mist">
          Already approved?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-bright hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </FormProvider>
  );
}
