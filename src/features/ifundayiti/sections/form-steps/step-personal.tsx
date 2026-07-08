"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StepPersonal() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          Full Name (Must match National ID)
        </Label>
        <Input
          id="name"
          {...register("name")}
          className="bg-ink/40 border-hairline text-cloud placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="e.g. Jean-Baptiste Pierre"
        />
        {errors.name && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.name.message as string}</span>
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
            {...register("dob")}
            className="bg-ink/40 border-hairline text-cloud block focus:ring-violet/40 focus:border-violet"
          />
          {errors.dob && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.dob.message as string}</span>
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="nationality" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
            Nationality
          </Label>
          <Input
            id="nationality"
            {...register("nationality")}
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
          {...register("location")}
          className="bg-ink/40 border-hairline text-cloud min-h-22.5 placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="e.g. Cap-Haïtien, Rue 24 A, House #14"
        />
        {errors.location && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.location.message as string}</span>
          </p>
        )}
      </div>
    </div>
  );
}
