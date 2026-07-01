"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Search, ShieldCheck, GraduationCap } from "lucide-react";

import {
  type ExpertRegisterValues,
  expertiseOptions,
  yearsExperienceOptions,
} from "@/lib/validators";
import { Input } from "@/components/ui/input";
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

/** Step 2 — areas of expertise (searchable multi-select) & background. */
export function StepExpertise() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ExpertRegisterValues>();
  const [query, setQuery] = React.useState("");

  const filtered = expertiseOptions.filter((opt) =>
    opt.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Primary expertise */}
      <section className="flex flex-col gap-4">
        <StepHeader
          icon={ShieldCheck}
          title="Primary expertise"
          description="Choose the areas you advise on — pick up to 6 so your profile stays focused."
        />

        <Controller
          control={control}
          name="expertise"
          render={({ field }) => {
            const value = field.value ?? [];
            const toggle = (opt: string) =>
              field.onChange(
                value.includes(opt)
                  ? value.filter((v) => v !== opt)
                  : [...value, opt],
              );

            return (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search expertise fields…"
                    aria-label="Search expertise fields"
                    className="pl-11"
                  />
                </div>

                {filtered.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((opt) => (
                      <CheckboxCard
                        key={opt}
                        label={opt}
                        checked={value.includes(opt)}
                        onToggle={() => toggle(opt)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 text-sm text-faint">
                    No fields match “{query}”.
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <FieldError message={errors.expertise?.message as string} />
                  {value.length > 0 && (
                    <span className="ml-auto text-xs text-faint">
                      {value.length} selected
                    </span>
                  )}
                </div>
              </div>
            );
          }}
        />
      </section>

      {/* Experience & background */}
      <section className="flex flex-col gap-4">
        <StepHeader
          icon={GraduationCap}
          title="Experience & background"
          description="A little credibility goes a long way with members."
        />

        <div className="grid gap-5 sm:grid-cols-1">
          <div className="flex flex-col gap-2">
            <Label htmlFor="yearsExperience">Years of experience</Label>
            <Controller
              control={control}
              name="yearsExperience"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="yearsExperience"
                    aria-invalid={!!errors.yearsExperience}
                  >
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearsExperienceOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.yearsExperience?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="degree">
              Highest degree / certification{" "}
              <span className="text-faint">(optional)</span>
            </Label>
            <Input
              id="degree"
              placeholder="e.g. MBA, CFA, Ph.D"
              aria-invalid={!!errors.degree}
              {...register("degree")}
            />
            <FieldError message={errors.degree?.message} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="linkedin">
              LinkedIn profile URL{" "}
              <span className="text-faint">(optional)</span>
            </Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/username"
              aria-invalid={!!errors.linkedin}
              {...register("linkedin")}
            />
            <FieldError message={errors.linkedin?.message} />
          </div>
        </div>
      </section>
    </div>
  );
}
