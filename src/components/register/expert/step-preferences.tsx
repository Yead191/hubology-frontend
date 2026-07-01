"use client";

import Link from "next/link";
import { useFormContext, Controller } from "react-hook-form";
import { SlidersHorizontal } from "lucide-react";

import {
  type ExpertRegisterValues,
  hourlyRateOptions,
  availabilityOptions,
  consultationTypeOptions,
} from "@/lib/validators";
import { Label } from "@/components/ui/label";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/auth/field-error";
import { StepHeader } from "./step-header";

/** Step 3 — rates, availability, consultation types & final consent. */
export function StepPreferences() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ExpertRegisterValues>();

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        icon={SlidersHorizontal}
        title="Consulting preferences"
        description="Set how you like to work. You can fine-tune all of this later."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="hourlyRate">Hourly rate range (USD)</Label>
          <Controller
            control={control}
            name="hourlyRate"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="hourlyRate"
                  aria-invalid={!!errors.hourlyRate}
                >
                  <SelectValue placeholder="Select a rate range" />
                </SelectTrigger>
                <SelectContent>
                  {hourlyRateOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.hourlyRate?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="availability">Availability</Label>
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="availability"
                  aria-invalid={!!errors.availability}
                >
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.availability?.message} />
        </div>
      </div>

      {/* Consultation types (multi-select) */}
      <div className="flex flex-col gap-3">
        <Label>Consultation types</Label>
        <Controller
          control={control}
          name="consultationTypes"
          render={({ field }) => {
            const value = field.value ?? [];
            const toggle = (opt: string) =>
              field.onChange(
                value.includes(opt)
                  ? value.filter((v) => v !== opt)
                  : [...value, opt],
              );
            return (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {consultationTypeOptions.map((opt) => (
                    <CheckboxCard
                      key={opt}
                      label={opt}
                      checked={value.includes(opt)}
                      onToggle={() => toggle(opt)}
                    />
                  ))}
                </div>
                <FieldError
                  message={errors.consultationTypes?.message as string}
                />
              </>
            );
          }}
        />
      </div>

      {/* Consent */}
      <label className="flex cursor-pointer items-start gap-3 border-t border-hairline pt-6 text-sm text-mist">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-hairline-strong bg-white/3 accent-violet"
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
    </div>
  );
}
