"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validators";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { RESET_TOKEN_KEY } from "@/components/auth/verify-otp-form";

export function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const stored = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!stored) {
      toast.error("Your reset session has expired. Please start again.", {
        id: "reset-password",
      });
      router.replace("/forgot-password");
      return;
    }
    setToken(stored);
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      toast.error("Missing reset token. Please start again.", {
        id: "reset-password",
      });
      router.replace("/forgot-password");
      return;
    }

    try {
      const response = await nextFetch("/auth/reset-password", {
        method: "POST",
        token,
        body: {
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      });

      if (response?.success) {
        sessionStorage.removeItem(RESET_TOKEN_KEY);
        toast.success(response?.message || "Password reset — please sign in.");
        router.push("/login");
        return;
      }

      if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "reset-password" });
        });
      } else {
        toast.error(response?.message || "Could not reset password.", {
          id: "reset-password",
        });
      }
    } catch (err) {
      console.error("reset-password error:", err);
      toast.error("Network error. Please try again.", { id: "reset-password" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 text-left">
        <Label htmlFor="newPassword">New password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="pr-11"
            aria-invalid={!!errors.newPassword}
            {...register("newPassword")}
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
        <FieldError message={errors.newPassword?.message} />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || !token}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Updating password…
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}
