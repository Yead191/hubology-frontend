"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StepGrant() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-4 items-end">
        <div className="sm:col-span-3">
          <Label htmlFor="projectName" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
            Business / Project Name
          </Label>
          <Input
            id="projectName"
            {...register("projectName")}
            className="bg-ink/40 border-hairline text-cloud placeholder:text-faint focus:ring-violet/40 focus:border-violet"
            placeholder="e.g. Cap-Haitien Solar Kiosk"
          />
          {errors.projectName && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.projectName.message as string}</span>
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
            {...register("requestedAmount", { valueAsNumber: true })}
            className="bg-ink/40 border-hairline text-cloud focus:ring-violet/40 focus:border-violet"
          />
        </div>
        {errors.requestedAmount && (
          <p className="col-span-full text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.requestedAmount.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="projectDescription" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          Project Description & Story
        </Label>
        <Textarea
          id="projectDescription"
          {...register("projectDescription")}
          className="bg-ink/40 border-hairline text-cloud min-h-[90px] placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="Explain what your business is and the story behind it..."
        />
        {errors.projectDescription && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.projectDescription.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="fundUsage" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          How the money will be used
        </Label>
        <Textarea
          id="fundUsage"
          {...register("fundUsage")}
          className="bg-ink/40 border-hairline text-cloud min-h-[70px] placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="Detailed breakdown: e.g. solar panels, battery, cables..."
        />
        {errors.fundUsage && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.fundUsage.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="expectedImpact" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          Expected Community Impact
        </Label>
        <Textarea
          id="expectedImpact"
          {...register("expectedImpact")}
          className="bg-ink/40 border-hairline text-cloud min-h-[70px] placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="How will this support your neighbors or city?..."
        />
        {errors.expectedImpact && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.expectedImpact.message as string}</span>
          </p>
        )}
      </div>
    </div>
  );
}
