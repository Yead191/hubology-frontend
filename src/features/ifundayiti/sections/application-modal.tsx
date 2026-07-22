"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X, Check, AlertCircle, Clipboard, Loader2,
  Printer, ArrowLeft, ArrowRight, Search
} from "lucide-react";
import { useIFundAyiti } from "../context/ifundayiti-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Import extracted schemas and types
import {
  personalSchema,
  contactSchema,
  idSchema,
  grantSchema,
  backgroundSchema,
  agreementSchema
} from "@/lib/ifundayiti-schemas";

// Import modular step components
import { StepPersonal } from "./form-steps/step-personal";
import { StepContact } from "./form-steps/step-contact";
import { StepId } from "./form-steps/step-id";
import { StepGrant } from "./form-steps/step-grant";
import { StepDocuments } from "./form-steps/step-documents";
import { StepBackground } from "./form-steps/step-background";
import { StepAgreement } from "./form-steps/step-agreement";

interface FileMock {
  name: string;
  size?: string;
}

export function IFundAyitiApplicationModal() {
  const { showAppModal, setShowAppModal, submitApplication } = useIFundAyiti();

  // Step state: 1 to 7, Step 8 = Success Page
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [copied, setCopied] = useState(false);

  // Files state (step 5)
  const [govIdFile, setGovIdFile] = useState<FileMock | null>(null);
  const [proofAddrFile, setProofAddrFile] = useState<FileMock | null>(null);
  const [businessPlanFile, setBusinessPlanFile] = useState<FileMock | null>(null);
  const [fileError, setFileError] = useState("");

  // Setup form states for each step using extracted schemas
  const personalForm = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: { name: "", dob: "", nationality: "Haitian", location: "" }
  });

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "", phone: "" }
  });

  const idForm = useForm({
    resolver: zodResolver(idSchema),
    defaultValues: { nationalId: "", passport: "" }
  });

  const grantForm = useForm({
    resolver: zodResolver(grantSchema),
    defaultValues: { projectName: "", projectDescription: "", requestedAmount: 1000, fundUsage: "", expectedImpact: "" }
  });

  const backgroundForm = useForm({
    resolver: zodResolver(backgroundSchema),
    defaultValues: { occupation: "", financialBackground: "" }
  });

  const agreementForm = useForm({
    resolver: zodResolver(agreementSchema),
    defaultValues: { certifyAccurate: false, noGuarantee: false, disqualification: false }
  });

  if (!showAppModal) return null;

  // Validate current step before proceeding
  const handleNext = async () => {
    let valid = false;

    if (step === 1) valid = await personalForm.trigger();
    else if (step === 2) valid = await contactForm.trigger();
    else if (step === 3) valid = await idForm.trigger();
    else if (step === 4) valid = await grantForm.trigger();
    else if (step === 5) {
      if (!govIdFile) {
        setFileError("Government-issued ID is required");
        return;
      }
      if (!proofAddrFile) {
        setFileError("Proof of Address is required");
        return;
      }
      setFileError("");
      valid = true;
    }
    else if (step === 6) valid = await backgroundForm.trigger();

    if (valid) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  // Submit complete wizard
  const onSubmit = async () => {
    const isAgreeValid = await agreementForm.trigger();
    if (!isAgreeValid) return;

    setLoading(true);

    const fullDetails = {
      name: personalForm.getValues("name"),
      dob: personalForm.getValues("dob"),
      nationality: personalForm.getValues("nationality"),
      location: personalForm.getValues("location"),
      email: contactForm.getValues("email"),
      phone: contactForm.getValues("phone"),
      nationalId: idForm.getValues("nationalId"),
      passport: idForm.getValues("passport") || "",
      projectName: grantForm.getValues("projectName"),
      projectDescription: grantForm.getValues("projectDescription"),
      requestedAmount: Number(grantForm.getValues("requestedAmount")),
      fundUsage: grantForm.getValues("fundUsage"),
      expectedImpact: grantForm.getValues("expectedImpact"),
      occupation: backgroundForm.getValues("occupation"),
      financialBackground: backgroundForm.getValues("financialBackground"),
      documents: [
        { type: "Government ID", name: govIdFile?.name || "Uploaded_ID.pdf" },
        { type: "Proof of Address", name: proofAddrFile?.name || "Uploaded_Proof.pdf" },
        ...(businessPlanFile ? [{ type: "Business Plan", name: businessPlanFile.name }] : [])
      ]
    };

    // console.log("Full Details:", fullDetails);

    setTimeout(() => {
      const tid = submitApplication(fullDetails);
      setTrackingId(tid);
      setLoading(false);
      setStep(8); // Move to success page
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    personalForm.reset();
    contactForm.reset();
    idForm.reset();
    grantForm.reset();
    backgroundForm.reset();
    agreementForm.reset();
    setGovIdFile(null);
    setProofAddrFile(null);
    setBusinessPlanFile(null);
    setStep(1);
    setShowAppModal(false);
  };

  const stepLabels = [
    "Personal Details",
    "Contact Details",
    "Identification",
    "Grant Project",
    "Documentation",
    "Finance Check",
    "Agreement"
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-panel-soft border border-hairline-strong rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8">

        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4 bg-panel">
          <div>
            <h3 className="font-display font-bold text-cloud text-lg">IFundAyiti Grant Application</h3>
            {step < 8 && (
              <p className="text-xs text-faint mt-0.5">
                Step {step} of 7: {stepLabels[step - 1]}
              </p>
            )}
          </div>
          {step < 8 && (
            <button
              onClick={resetForm}
              className="p-1.5 rounded-full border border-hairline bg-white/3 text-mist hover:text-cloud hover:bg-white/8 outline-none cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Progress header bar */}
        {step < 8 && (
          <div className="h-1 bg-white/5 w-full">
            <div
              className="h-full bg-linear-to-r from-violet-bright to-violet transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        )}

        {/* Modal content body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[70vh]">

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <FormProvider {...personalForm}>
              <StepPersonal />
            </FormProvider>
          )}

          {/* STEP 2: Contact Information */}
          {step === 2 && (
            <FormProvider {...contactForm}>
              <StepContact />
            </FormProvider>
          )}

          {/* STEP 3: Identification Details */}
          {step === 3 && (
            <FormProvider {...idForm}>
              <StepId />
            </FormProvider>
          )}

          {/* STEP 4: Grant / Business Details */}
          {step === 4 && (
            <FormProvider {...grantForm}>
              <StepGrant />
            </FormProvider>
          )}

          {/* STEP 5: Supporting Documents */}
          {step === 5 && (
            <StepDocuments
              govIdFile={govIdFile}
              setGovIdFile={setGovIdFile}
              proofAddrFile={proofAddrFile}
              setProofAddrFile={setProofAddrFile}
              businessPlanFile={businessPlanFile}
              setBusinessPlanFile={setBusinessPlanFile}
              fileError={fileError}
            />
          )}

          {/* STEP 6: Financial background */}
          {step === 6 && (
            <FormProvider {...backgroundForm}>
              <StepBackground />
            </FormProvider>
          )}

          {/* STEP 7: Checkbox agreements */}
          {step === 7 && (
            <FormProvider {...agreementForm}>
              <StepAgreement />
            </FormProvider>
          )}

          {/* STEP 8: Success View */}
          {step === 8 && (
            <div className="text-center py-6">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
                <Check className="h-8 w-8" />
              </div>

              <h3 className="font-display font-bold text-2xl text-cloud">Application Submitted!</h3>
              <p className="text-sm text-mist max-w-md mx-auto mt-2 leading-relaxed">
                Your application has been received and logged under status <strong className="text-emerald-300">Submitted</strong>. Vetting begins immediately.
              </p>

              {/* Receipt Area */}
              <div className="border border-hairline bg-ink/40 p-6 rounded-2xl my-8 max-w-md mx-auto text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 h-2 bg-linear-to-r from-violet-bright to-violet w-full" />
                <span className="block text-[10px] uppercase tracking-wider text-faint">Your Unique Tracking ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-2xl font-bold text-cloud tracking-wide">{trackingId}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-lg border border-hairline bg-white/3 text-mist hover:text-cloud hover:bg-white/8 transition-colors text-xs flex items-center gap-1 outline-none cursor-pointer"
                  >
                    <Clipboard className="h-3.5 w-3.5" />
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-hairline/50 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="block text-faint">Applicant</span>
                    <span className="font-medium text-cloud mt-0.5 block">{personalForm.getValues("name")}</span>
                  </div>
                  <div>
                    <span className="block text-faint">Project</span>
                    <span className="font-medium text-cloud mt-0.5 block truncate">{grantForm.getValues("projectName")}</span>
                  </div>
                  <div>
                    <span className="block text-faint">Date of Birth</span>
                    <span className="font-mono font-medium text-cloud mt-0.5 block">{personalForm.getValues("dob")}</span>
                  </div>
                  <div>
                    <span className="block text-faint">Requested</span>
                    <span className="font-medium text-cloud mt-0.5 block">{formatPrice(Number(grantForm.getValues("requestedAmount")))}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 max-w-md mx-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-hairline bg-white/3 hover:bg-white/8 px-4 py-2.5 rounded-xl text-xs font-semibold text-cloud outline-none cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    // Scroll to tracking search widget
                    const el = document.getElementById("find-application");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-violet-bright hover:bg-violet-bright/90 px-4 py-2.5 rounded-xl text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>Track Status</span>
                </button>
              </div>

              <button
                onClick={resetForm}
                className="mt-8 text-xs font-semibold text-faint hover:text-cloud transition-colors block mx-auto outline-none cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}

        </div>

        {/* Action button triggers for stepper navigation */}
        {step < 8 && (
          <div className="flex items-center justify-between border-t border-hairline px-6 py-4 bg-panel">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className="text-cloud border-transparent hover:bg-white/4 disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back</span>
            </Button>

            {step < 7 ? (
              <Button
                onClick={handleNext}
                className="bg-violet hover:bg-violet-bright text-white cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={onSubmit}
                disabled={loading}
                className="bg-violet-bright hover:bg-violet-bright/90 glow-violet text-white cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    <span>Submit Application</span>
                  </>
                )}
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
