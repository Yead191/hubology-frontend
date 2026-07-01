"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";

import {
  expertRegisterSchema,
  type ExpertRegisterValues,
} from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { RegisterSuccess } from "@/components/register/member-register-form";
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
  const [done, setDone] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const methods = useForm<ExpertRegisterValues>({
    resolver: zodResolver(expertRegisterSchema),
    mode: "onTouched",
    defaultValues: {
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
  }

  function clearPhoto() {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(null);
    setPreview(null);
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

  // Submit via FormData (includes photo + array fields) — ready for a real endpoint.
  async function onValid(values: ExpertRegisterValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, String(item)));
      } else {
        formData.append(key, String(value));
      }
    });
    if (photo) formData.append("profilePhoto", photo);

    await new Promise((r) => setTimeout(r, 1000));
    // eslint-disable-next-line no-console
    console.log("expert application:", {
      ...values,
      profilePhoto: photo?.name ?? null,
    });
    setDone(true);
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

  if (done) return <RegisterSuccess role="expert" />;

  return (
    <FormProvider {...methods}>
      <div className="mb-8">
        <ExpertStepper steps={STEPS} current={step} />
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

        {/* Navigation */}
        <div className="flex items-center gap-3 border-t border-hairline pt-6">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          <div className="ml-auto">
            {!isLast ? (
              <Button type="button" onClick={goNext}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={isSubmitting}>
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
