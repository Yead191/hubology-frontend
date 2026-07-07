"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";

export function StepAgreement() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
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
            {...register("certifyAccurate")}
            className="h-4 w-4 rounded border-hairline bg-ink text-violet-bright mt-0.5 focus:ring-violet/40 cursor-pointer"
          />
          <Label htmlFor="certifyAccurate" className="text-xs text-cloud select-none cursor-pointer">
            I certify that all information provided in this application is accurate and matches my legal documentation.
          </Label>
        </div>
        {errors.certifyAccurate && (
          <p className="text-xs text-rose-400 pl-7">
            {errors.certifyAccurate.message as string}
          </p>
        )}

        {/* Checkbox 2 */}
        <div className="flex items-start gap-3">
          <input
            id="noGuarantee"
            type="checkbox"
            {...register("noGuarantee")}
            className="h-4 w-4 rounded border-hairline bg-ink text-violet-bright mt-0.5 focus:ring-violet/40 cursor-pointer"
          />
          <Label htmlFor="noGuarantee" className="text-xs text-cloud select-none cursor-pointer">
            I understand that submitting this application does not guarantee funding from the program fund.
          </Label>
        </div>
        {errors.noGuarantee && (
          <p className="text-xs text-rose-400 pl-7">
            {errors.noGuarantee.message as string}
          </p>
        )}

        {/* Checkbox 3 */}
        <div className="flex items-start gap-3">
          <input
            id="disqualification"
            type="checkbox"
            {...register("disqualification")}
            className="h-4 w-4 rounded border-hairline bg-ink text-violet-bright mt-0.5 focus:ring-violet/40 cursor-pointer"
          />
          <Label htmlFor="disqualification" className="text-xs text-cloud select-none cursor-pointer">
            I understand that incomplete, mock, or false details will result in immediate disqualification.
          </Label>
        </div>
        {errors.disqualification && (
          <p className="text-xs text-rose-400 pl-7">
            {errors.disqualification.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
