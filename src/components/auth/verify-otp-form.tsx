"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { useResendOtp } from "@/hooks/useResendOtp";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";

/** sessionStorage key that carries the reset token to /reset-password. */
export const RESET_TOKEN_KEY = "hubology:resetToken";

// Change to 4 if your backend issues 4-digit codes (e.g. the "5372" example).
const OTP_LENGTH = 4;

export function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const flow = params.get("flow") === "reset" ? "reset" : "verify";

  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { resend, resendIn, isCoolingDown } = useResendOtp();

  const submit = React.useCallback(
    async (oneTimeCode: string) => {
      if (!email) {
        toast.error("Missing email address. Please restart the process.", {
          id: "verify-otp",
        });
        return;
      }
      if (oneTimeCode.length !== OTP_LENGTH) {
        toast.error(`Enter the ${OTP_LENGTH}-digit code`, { id: "verify-otp" });
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await nextFetch("/auth/verify-email", {
          method: "POST",
          body: { email, oneTimeCode: Number(oneTimeCode) },
        });

        if (!response?.success) {
          toast.error(response?.message || "Invalid or expired code", {
            id: "verify-otp",
          });
          setCode("");
          return;
        }

        toast.success(response?.message || "Email verified", {
          id: "verify-otp",
        });

        if (flow === "reset") {
          // The reset-password token comes back on response.data. Handle the
          // common shapes (string, or an object with a token field).
          const data = response.data as
            | string
            | Record<string, string>
            | undefined;
          const token =
            typeof data === "string"
              ? data
              : (data?.resetPasswordToken ??
                data?.resetToken ??
                data?.token ??
                data?.accessToken);

          if (!token) {
            toast.error("Could not read reset token. Please try again.", {
              id: "verify-otp",
            });
            return;
          }
          sessionStorage.setItem(RESET_TOKEN_KEY, token);
          router.push("/reset-password");
          return;
        }

        router.push("/login");
      } catch (err) {
        console.error("verify-email error:", err);
        toast.error("Network error. Please try again.", { id: "verify-otp" });
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, flow, router],
  );

  return (
    <div className="flex flex-col gap-6">
      <OtpInput
        value={code}
        onChange={setCode}
        length={OTP_LENGTH}
        disabled={isSubmitting}
        onComplete={(full) => submit(full)}
      />

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={isSubmitting || code.length !== OTP_LENGTH}
        onClick={() => submit(code)}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
          </>
        ) : flow === "reset" ? (
          "Verify & continue"
        ) : (
          "Verify email"
        )}
      </Button>

      <p className="text-center text-sm text-mist">
        Didn&apos;t get the code?{" "}
        <button
          type="button"
          onClick={() => resend(email)}
          disabled={isCoolingDown || !email}
          className="font-medium text-violet-bright transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
        >
          {isCoolingDown ? `Resend in ${resendIn}s` : "Resend code"}
        </button>
      </p>
    </div>
  );
}
