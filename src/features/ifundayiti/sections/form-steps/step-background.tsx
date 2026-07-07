"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StepBackground() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="occupation" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          Current Occupation
        </Label>
        <Input
          id="occupation"
          {...register("occupation")}
          className="bg-ink/40 border-hairline text-cloud placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="e.g. Unemployed / Market Vendor / Carpenter"
        />
        {errors.occupation && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.occupation.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="financialBackground" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          Brief Financial Background / Challenge
        </Label>
        <Textarea
          id="financialBackground"
          {...register("financialBackground")}
          className="bg-ink/40 border-hairline text-cloud min-h-[90px] placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="Explain your income situation and why this grant is critical to your survival/growth..."
        />
        {errors.financialBackground && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.financialBackground.message as string}</span>
          </p>
        )}
      </div>
    </div>
  );
}
