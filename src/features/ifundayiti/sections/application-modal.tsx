"use client";

import React, { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  X, Check, AlertCircle, FileUp, Clipboard, Loader2, 
  Printer, ArrowLeft, ArrowRight, Download, Search
} from "lucide-react";
import { useIFundAyiti } from "../context/ifundayiti-context";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Form schemas for validation using Zod
const personalSchema = z.object({
  name: z.string().min(2, "Full Name must match your National ID"),
  dob: z.string().min(1, "Date of Birth is required"),
  nationality: z.string().min(1, "Nationality is required").default("Haitian"),
  location: z.string().min(5, "Full Address is required"),
});

const contactSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(8, "Enter a valid phone number"),
});

const idSchema = z.object({
  nationalId: z.string().min(10, "National ID Number is required"),
  passport: z.string().optional(),
});

const grantSchema = z.object({
  projectName: z.string().min(3, "Project Name is required"),
  projectDescription: z.string().min(15, "Please provide a detailed description (min 15 chars)"),
  requestedAmount: z.number().min(50, "Minimum request is $50").max(1000, "Maximum grant request is $1,000"),
  fundUsage: z.string().min(15, "Explain how the fund will be utilized"),
  expectedImpact: z.string().min(15, "Explain the expected community impact"),
});

const backgroundSchema = z.object({
  occupation: z.string().min(2, "Current occupation is required"),
  financialBackground: z.string().min(15, "Brief financial background is required"),
});

const agreementSchema = z.object({
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

interface FileMock {
  type: string;
  name: string;
}

export function IFundAyitiApplicationModal() {
  const { showAppModal, setShowAppModal, submitApplication } = useIFundAyiti();
  
  // Step state: 1 to 7, Step 8 = Success Page
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [copied, setCopied] = useState(false);

  // Files state
  const [govIdFile, setGovIdFile] = useState<FileMock | null>(null);
  const [proofAddrFile, setProofAddrFile] = useState<FileMock | null>(null);
  const [businessPlanFile, setBusinessPlanFile] = useState<FileMock | null>(null);
  const [fileError, setFileError] = useState("");

  // Setup form states for each step
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

  // Next triggers per step with validation checks
  const handleNext = async () => {
    let valid = false;
    
    if (step === 1) valid = await personalForm.trigger();
    else if (step === 2) valid = await contactForm.trigger();
    else if (step === 3) valid = await idForm.trigger();
    else if (step === 4) valid = await grantForm.trigger();
    else if (step === 5) {
      // Validate files upload
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
      passport: idForm.getValues("passport"),
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

    // Simulate network delay
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

  const handleFileChange = (type: "id" | "addr" | "business", filename: string) => {
    const mock = { type, name: filename };
    if (type === "id") setGovIdFile(mock);
    else if (type === "addr") setProofAddrFile(mock);
    else if (type === "business") setBusinessPlanFile(mock);
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
              className="h-full bg-gradient-to-r from-violet-bright to-violet transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        )}

        {/* Modal content body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[70vh]">

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <form className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Full Name (Must match National ID)
                </Label>
                <Input
                  id="name"
                  {...personalForm.register("name")}
                  className="bg-ink/40 border-hairline text-cloud placeholder:text-faint"
                  placeholder="e.g. Jean-Baptiste Pierre"
                />
                {personalForm.formState.errors.name && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {personalForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dob" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    {...personalForm.register("dob")}
                    className="bg-ink/40 border-hairline text-cloud block"
                  />
                  {personalForm.formState.errors.dob && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {personalForm.formState.errors.dob.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nationality" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                    Nationality
                  </Label>
                  <Input
                    id="nationality"
                    {...personalForm.register("nationality")}
                    disabled
                    className="bg-ink/20 border-hairline/50 text-mist"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Location (Department / City / Full Address)
                </Label>
                <Textarea
                  id="location"
                  {...personalForm.register("location")}
                  className="bg-ink/40 border-hairline text-cloud min-h-[90px] placeholder:text-faint"
                  placeholder="e.g. Cap-Haïtien, Rue 24 A, House #14"
                />
                {personalForm.formState.errors.location && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {personalForm.formState.errors.location.message}
                  </p>
                )}
              </div>
            </form>
          )}

          {/* STEP 2: Contact Information */}
          {step === 2 && (
            <form className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...contactForm.register("email")}
                  className="bg-ink/40 border-hairline text-cloud placeholder:text-faint"
                  placeholder="e.g. name@domain.com"
                />
                {contactForm.formState.errors.email && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {contactForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  {...contactForm.register("phone")}
                  className="bg-ink/40 border-hairline text-cloud placeholder:text-faint"
                  placeholder="e.g. +509 3712-3456"
                />
                {contactForm.formState.errors.phone && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {contactForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: Identification Details */}
          {step === 3 && (
            <form className="space-y-4">
              <div>
                <Label htmlFor="nationalId" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  National Identification ID (CIN / NIF)
                </Label>
                <Input
                  id="nationalId"
                  {...idForm.register("nationalId")}
                  className="bg-ink/40 border-hairline text-cloud placeholder:text-faint"
                  placeholder="e.g. 01-01-99-1994-04-00101"
                />
                {idForm.formState.errors.nationalId && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {idForm.formState.errors.nationalId.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="passport" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Passport Number (Optional)
                </Label>
                <Input
                  id="passport"
                  {...idForm.register("passport")}
                  className="bg-ink/40 border-hairline text-cloud placeholder:text-faint"
                  placeholder="e.g. HH123456"
                />
              </div>
            </form>
          )}

          {/* STEP 4: Grant / Business Details */}
          {step === 4 && (
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4 items-end">
                <div className="sm:col-span-3">
                  <Label htmlFor="projectName" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                    Business / Project Name
                  </Label>
                  <Input
                    id="projectName"
                    {...grantForm.register("projectName")}
                    className="bg-ink/40 border-hairline text-cloud placeholder:text-faint"
                    placeholder="e.g. Cap-Haitien Solar Kiosk"
                  />
                  {grantForm.formState.errors.projectName && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {grantForm.formState.errors.projectName.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-1">
                  <Label htmlFor="requestedAmount" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                    Requested ($)
                  </Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    {...grantForm.register("requestedAmount", { valueAsNumber: true })}
                    className="bg-ink/40 border-hairline text-cloud"
                  />
                </div>
                {grantForm.formState.errors.requestedAmount && (
                  <p className="col-span-full text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {grantForm.formState.errors.requestedAmount.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="projectDescription" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Project Description & Story
                </Label>
                <Textarea
                  id="projectDescription"
                  {...grantForm.register("projectDescription")}
                  className="bg-ink/40 border-hairline text-cloud min-h-[90px] placeholder:text-faint"
                  placeholder="Explain what your business is and the story behind it..."
                />
                {grantForm.formState.errors.projectDescription && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {grantForm.formState.errors.projectDescription.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="fundUsage" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  How the money will be used
                </Label>
                <Textarea
                  id="fundUsage"
                  {...grantForm.register("fundUsage")}
                  className="bg-ink/40 border-hairline text-cloud min-h-[70px] placeholder:text-faint"
                  placeholder="Detailed breakdown: e.g. solar panels, battery, cables..."
                />
                {grantForm.formState.errors.fundUsage && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {grantForm.formState.errors.fundUsage.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="expectedImpact" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Expected Community Impact
                </Label>
                <Textarea
                  id="expectedImpact"
                  {...grantForm.register("expectedImpact")}
                  className="bg-ink/40 border-hairline text-cloud min-h-[70px] placeholder:text-faint"
                  placeholder="How will this support your neighbors or city?..."
                />
                {grantForm.formState.errors.expectedImpact && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {grantForm.formState.errors.expectedImpact.message}
                  </p>
                )}
              </div>
            </form>
          )}

          {/* STEP 5: Supporting Documents */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  <strong>Warning:</strong> Missing required documents may result in your application being rejected during the screening process.
                </p>
              </div>

              {/* Upload Item 1 */}
              <div className="border border-hairline rounded-2xl p-4 bg-ink/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="block text-sm font-semibold text-cloud">Government-issued ID *</span>
                  <span className="text-xs text-faint">National ID Card or Passport Scan (Required)</span>
                  {govIdFile && (
                    <span className="mt-1.5 block text-xs font-medium text-emerald-300 flex items-center gap-1">
                      <Check className="h-3 w-3" /> {govIdFile.name}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChange("id", "Government_ID_CIN.jpg")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cloud px-4 py-2 border border-hairline bg-white/3 hover:bg-white/8 rounded-xl outline-none transition-colors cursor-pointer"
                >
                  <FileUp className="h-3.5 w-3.5" />
                  <span>{govIdFile ? "Change File" : "Select ID File"}</span>
                </button>
              </div>

              {/* Upload Item 2 */}
              <div className="border border-hairline rounded-2xl p-4 bg-ink/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="block text-sm font-semibold text-cloud">Proof of Address *</span>
                  <span className="text-xs text-faint">Utility Bill, Tax Record, or Rent Slip (Required)</span>
                  {proofAddrFile && (
                    <span className="mt-1.5 block text-xs font-medium text-emerald-300 flex items-center gap-1">
                      <Check className="h-3 w-3" /> {proofAddrFile.name}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChange("addr", "Utility_Address_Bill.pdf")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cloud px-4 py-2 border border-hairline bg-white/3 hover:bg-white/8 rounded-xl outline-none transition-colors cursor-pointer"
                >
                  <FileUp className="h-3.5 w-3.5" />
                  <span>{proofAddrFile ? "Change File" : "Select Proof File"}</span>
                </button>
              </div>

              {/* Upload Item 3 */}
              <div className="border border-hairline rounded-2xl p-4 bg-ink/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="block text-sm font-semibold text-cloud">Business Plan / Images</span>
                  <span className="text-xs text-faint">Mock plan, supporting product images (Optional)</span>
                  {businessPlanFile && (
                    <span className="mt-1.5 block text-xs font-medium text-emerald-300 flex items-center gap-1">
                      <Check className="h-3 w-3" /> {businessPlanFile.name}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChange("business", "Business_Plan_Budget.pdf")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cloud px-4 py-2 border border-hairline bg-white/3 hover:bg-white/8 rounded-xl outline-none transition-colors cursor-pointer"
                >
                  <FileUp className="h-3.5 w-3.5" />
                  <span>{businessPlanFile ? "Change File" : "Select Plan File"}</span>
                </button>
              </div>

              {fileError && (
                <div className="flex items-center gap-2 text-xs text-rose-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Financial background */}
          {step === 6 && (
            <form className="space-y-4">
              <div>
                <Label htmlFor="occupation" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Current Occupation
                </Label>
                <Input
                  id="occupation"
                  {...backgroundForm.register("occupation")}
                  className="bg-ink/40 border-hairline text-cloud placeholder:text-faint"
                  placeholder="e.g. Unemployed / Market Vendor / Carpenter"
                />
                {backgroundForm.formState.errors.occupation && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {backgroundForm.formState.errors.occupation.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="financialBackground" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Brief Financial Background / Challenge
                </Label>
                <Textarea
                  id="financialBackground"
                  {...backgroundForm.register("financialBackground")}
                  className="bg-ink/40 border-hairline text-cloud min-h-[90px] placeholder:text-faint"
                  placeholder="Explain your income situation and why this grant is critical to your survival/growth..."
                />
                {backgroundForm.formState.errors.financialBackground && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {backgroundForm.formState.errors.financialBackground.message}
                  </p>
                )}
              </div>
            </form>
          )}

          {/* STEP 7: Checkbox agreements */}
          {step === 7 && (
            <form className="space-y-6">
              <div className="border border-hairline p-5 rounded-2xl bg-ink/20 text-xs text-mist leading-relaxed">
                <span className="block font-bold text-cloud mb-2 uppercase tracking-wide">Legal Undertaking & Disclaimers</span>
                By checking the boxes below, you understand that IFundAyiti acts as a central vetting body. Funding selections are purely manual, determined by local reviewers and donor levels, and finalized in partnership outside of this application server.
              </div>

              <div className="space-y-4">
                {/* Checkbox 1 */}
                <div className="flex items-start gap-3">
                  <input
                    id="certifyAccurate"
                    type="checkbox"
                    {...agreementForm.register("certifyAccurate")}
                    className="h-4 w-4 rounded border-hairline bg-ink text-violet-bright mt-0.5"
                  />
                  <Label htmlFor="certifyAccurate" className="text-xs text-cloud select-none cursor-pointer">
                    I certify that all information provided in this application is accurate and matches my legal documentation.
                  </Label>
                </div>
                {agreementForm.formState.errors.certifyAccurate && (
                  <p className="text-xs text-rose-400 pl-7">{agreementForm.formState.errors.certifyAccurate.message}</p>
                )}

                {/* Checkbox 2 */}
                <div className="flex items-start gap-3">
                  <input
                    id="noGuarantee"
                    type="checkbox"
                    {...agreementForm.register("noGuarantee")}
                    className="h-4 w-4 rounded border-hairline bg-ink text-violet-bright mt-0.5"
                  />
                  <Label htmlFor="noGuarantee" className="text-xs text-cloud select-none cursor-pointer">
                    I understand that submitting this application does not guarantee funding from the program fund.
                  </Label>
                </div>
                {agreementForm.formState.errors.noGuarantee && (
                  <p className="text-xs text-rose-400 pl-7">{agreementForm.formState.errors.noGuarantee.message}</p>
                )}

                {/* Checkbox 3 */}
                <div className="flex items-start gap-3">
                  <input
                    id="disqualification"
                    type="checkbox"
                    {...agreementForm.register("disqualification")}
                    className="h-4 w-4 rounded border-hairline bg-ink text-violet-bright mt-0.5"
                  />
                  <Label htmlFor="disqualification" className="text-xs text-cloud select-none cursor-pointer">
                    I understand that incomplete, mock, or false details will result in immediate disqualification.
                  </Label>
                </div>
                {agreementForm.formState.errors.disqualification && (
                  <p className="text-xs text-rose-400 pl-7">{agreementForm.formState.errors.disqualification.message}</p>
                )}
              </div>
            </form>
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
                <div className="absolute top-0 right-0 h-2 bg-gradient-to-r from-violet-bright to-violet w-full" />
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
                    // Scroll to finder section
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
