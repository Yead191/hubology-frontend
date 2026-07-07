"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepId() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nationalId" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          National Identification ID (CIN / NIF)
        </Label>
        <Input
          id="nationalId"
          {...register("nationalId")}
          className="bg-ink/40 border-hairline text-cloud placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="e.g. 01-01-99-1994-04-00101"
        />
        {errors.nationalId && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.nationalId.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="passport" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          Passport Number (Optional)
        </Label>
        <Input
          id="passport"
          {...register("passport")}
          className="bg-ink/40 border-hairline text-cloud placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="e.g. HH123456"
        />
      </div>
    </div>
  );
}
