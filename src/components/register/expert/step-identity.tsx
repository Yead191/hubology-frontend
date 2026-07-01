"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X, UserRound, Eye, EyeOff } from "lucide-react";

import type { ExpertRegisterValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";
import { StepHeader } from "./step-header";

export interface PhotoControls {
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/** Step 1 — public identity & professional profile. */
export function StepIdentity({ photo }: { photo: PhotoControls }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ExpertRegisterValues>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        icon={UserRound}
        title="Personal & professional identity"
        description="This builds your public expert profile — it's what members see first."
      />

      {/* Profile photo */}
      <div className="flex flex-col gap-3">
        <Label>Profile photo</Label>
        <div className="flex items-center gap-5">
          <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-hairline-strong bg-white/3">
            {photo.preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.preview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <Upload className="h-6 w-6 text-faint" />
            )}
            {photo.preview && (
              <button
                type="button"
                onClick={photo.onClear}
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
              onClick={() => photo.inputRef.current?.click()}
            >
              Choose image
            </Button>
            <p className="text-xs text-faint">
              JPG, PNG or GIF · ideally 400×400px
            </p>
          </div>
          <input
            ref={photo.inputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={photo.onChange}
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

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input
            id="company"
            placeholder="e.g. Thorne Tax Advisory"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
          <FieldError message={errors.company?.message} />
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

      {/* Account credentials */}
      <div className="grid gap-5 border-t border-hairline pt-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              className="pr-11"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist transition-colors hover:text-cloud"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              className="pr-11"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist transition-colors hover:text-cloud"
            >
              {showConfirm ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
        </div>
      </div>
    </div>
  );
}
