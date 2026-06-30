"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";

import {
  expertRegisterSchema,
  expertiseOptions,
  type ExpertRegisterValues,
} from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/auth/field-error";
import { RegisterSuccess } from "@/components/register/member-register-form";

export function ExpertRegisterForm() {
  const [done, setDone] = React.useState(false);
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpertRegisterValues>({
    resolver: zodResolver(expertRegisterSchema),
    defaultValues: {
      fullName: "",
      jobTitle: "",
      email: "",
      contactNo: "",
      company: "",
      expertise: "",
      bio: "",
      agree: undefined,
    },
  });

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

  // Submit via FormData (includes the photo file) — ready for a real endpoint.
  async function onSubmit(values: ExpertRegisterValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, String(value)),
    );
    if (photo) formData.append("profilePhoto", photo);

    await new Promise((r) => setTimeout(r, 1000));
    // eslint-disable-next-line no-console
    console.log("expert application:", {
      ...Object.fromEntries(formData),
      profilePhoto: photo?.name ?? null,
    });
    setDone(true);
  }

  if (done) return <RegisterSuccess role="expert" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-cloud">
          Personal &amp; Professional Identity
        </h2>
        <p className="mt-1 text-sm text-mist">
          This information builds your public expert profile. Be specific — it is
          what members see first.
        </p>
      </div>

      {/* Profile photo */}
      <div className="flex flex-col gap-3">
        <Label>Profile photo</Label>
        <div className="flex items-center gap-5">
          <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-hairline-strong bg-white/[0.03]">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <Upload className="h-6 w-6 text-faint" />
            )}
            {preview && (
              <button
                type="button"
                onClick={clearPhoto}
                aria-label="Remove photo"
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/80 text-mist transition-colors hover:text-cloud"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose image
            </Button>
            <p className="text-xs text-faint">JPG, PNG or GIF · ideally 400×400px</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={handlePhoto}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="e.g. Dr. Helena Thorne"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="jobTitle">Job title</Label>
          <Input
            id="jobTitle"
            placeholder="e.g. Tax Strategist"
            aria-invalid={!!errors.jobTitle}
            {...register("jobTitle")}
          />
          <FieldError message={errors.jobTitle?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contactNo">Contact number</Label>
          <Input
            id="contactNo"
            type="tel"
            placeholder="+1 555 000 0000"
            aria-invalid={!!errors.contactNo}
            {...register("contactNo")}
          />
          <FieldError message={errors.contactNo?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input
            id="company"
            placeholder="e.g. Thorne Tax Advisory"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
          <FieldError message={errors.company?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="expertise">Primary expertise</Label>
          <Controller
            control={control}
            name="expertise"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="expertise" aria-invalid={!!errors.expertise}>
                  <SelectValue placeholder="Select your field" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.expertise?.message} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Professional bio</Label>
        <Textarea
          id="bio"
          rows={4}
          placeholder="Share your background, the kinds of clients you work with, and the outcomes you help them reach."
          aria-invalid={!!errors.bio}
          {...register("bio")}
        />
        <FieldError message={errors.bio?.message} />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-mist">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-hairline-strong bg-white/[0.03] accent-violet"
          {...register("agree")}
        />
        <span>
          I confirm the information above is accurate and agree to the{" "}
          <Link href="/" className="text-violet-bright hover:underline">
            Expert Terms
          </Link>
          .
        </span>
      </label>
      <FieldError message={errors.agree?.message} />

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting application…
          </>
        ) : (
          "Submit expert application"
        )}
      </Button>

      <p className="text-center text-sm text-mist">
        Already approved?{" "}
        <Link href="/login" className="font-medium text-violet-bright hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
