"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton, AuthDivider } from "@/components/auth/google-button";
import { FieldError } from "@/components/auth/field-error";
import { useRouter, useSearchParams } from "next/navigation";
import { useResendOtp } from "@/hooks/useResendOtp";
import { toast } from "sonner";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import Cookies from "js-cookie";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Return the user to where they came from (e.g. the booking page), else home.
  const redirectTo = searchParams.get("redirect") || "/";
  const { resend } = useResendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  // react-hook-form's handleSubmit passes the *validated values* here — not a
  // DOM event. (The previous version called e.preventDefault() on this object,
  // which threw and silently killed the submit.)
  const onSubmit = async (values: LoginValues) => {
    const { email, password } = values;

    try {
      const response = await nextFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      // console.log(response);
      // Unverified account → send a fresh code and route to verification.
      if (
        !response?.success &&
        response.message ===
          "Account is not verified. Please check your email for verification code."
      ) {
        await resend(email);
        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}&flow=verify`,
        );
        return;
      }

      if (response?.success) {
        Cookies.set("accessToken", response?.data?.createToken);
        Cookies.set("role", response?.data?.role);
        toast.success(response?.message || "Welcome back!");
        router.replace(redirectTo);
        return;
      }

      if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "login" });
        });
      } else {
        toast.error(response?.message || "Something went wrong!", {
          id: "login",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please try again.", { id: "login" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <GoogleButton label="Continue with Google" />
      <AuthDivider label="or sign in with email" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-violet-bright hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-11"
              aria-invalid={!!errors.password}
              {...register("password")}
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
          <FieldError message={errors.password?.message} />
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-mist">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-hairline-strong bg-white/3 accent-violet"
            {...register("remember")}
          />
          Keep me signed in
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-1 w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-mist">
        New to Hubology?{" "}
        <Link
          href="/join"
          className="font-medium text-violet-bright hover:underline"
        >
          Join the Hub
        </Link>
      </p>
    </div>
  );
}
