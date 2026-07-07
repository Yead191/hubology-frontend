"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepContact() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="bg-ink/40 border-hairline text-cloud placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="e.g. name@domain.com"
        />
        {errors.email && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.email.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
          Phone Number
        </Label>
        <Input
          id="phone"
          {...register("phone")}
          className="bg-ink/40 border-hairline text-cloud placeholder:text-faint focus:ring-violet/40 focus:border-violet"
          placeholder="e.g. +509 3712-3456"
        />
        {errors.phone && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.phone.message as string}</span>
          </p>
        )}
      </div>
    </div>
  );
}
