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
import { useRouter } from "next/navigation";
import { useResendOtp } from "@/hooks/useResendOtp";
import { toast } from "sonner";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import Cookies from "js-cookie";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { resend } = useResendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      toast.error("Please fill in all fields", { id: "login" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await nextFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      if (
        !response?.success &&
        response.message ===
          "Account is not verified. Please check your email for verification code."
      ) {
        await resend(email as string);
        setIsLoading(false);
        return;
      }
      if (response?.success) {
        Cookies.set("accessToken", response?.data?.accessToken);
        Cookies.set("role", response?.data?.role);
        toast.success(response?.message);
        // Callers that resume their own flow (e.g. a purchase) can opt out of
        // the default redirect to /home.
        router.replace("/");

        setIsLoading(false);
      } else {
        if (response?.error && Array.isArray(response.error)) {
          response.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "sign-up" });
          });
        } else {
          toast.error(response?.message || "Something went wrong!", {
            id: "sign-up",
          });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
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
              href="/login"
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
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-mist">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-hairline-strong bg-white/[0.03] accent-violet"
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

        {submitted && (
          <p className="rounded-xl border border-violet/30 bg-violet/10 px-4 py-3 text-sm text-violet-bright">
            Demo only — credentials validated. Connect an auth provider to sign
            in for real.
          </p>
        )}
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
