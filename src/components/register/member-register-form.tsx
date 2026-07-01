"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";

import {
  memberRegisterSchema,
  expertiseOptions,
  type MemberRegisterValues,
} from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GoogleButton, AuthDivider } from "@/components/auth/google-button";
import { FieldError } from "@/components/auth/field-error";

export function MemberRegisterForm() {
  const [done, setDone] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MemberRegisterValues>({
    resolver: zodResolver(memberRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      interest: "",
      password: "",
      agree: undefined,
    },
  });

  // Submit via FormData, as requested — ready to POST to a real endpoint.
  async function onSubmit(values: MemberRegisterValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, String(value)),
    );
    await new Promise((r) => setTimeout(r, 900));
    // eslint-disable-next-line no-console
    console.log("member registration:", Object.fromEntries(formData));
    setDone(true);
  }

  if (done) return <RegisterSuccess role="member" />;

  return (
    <div className="flex flex-col gap-6">
      <GoogleButton label="Sign up with Google" />
      <AuthDivider label="or with email" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="e.g. Jordan Avery"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Company / Organization <span className="text-faint">(optional)</span></Label>
          <Input
            id="company"
            placeholder="e.g. Northwind Studio"
            {...register("company")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="interest">What do you need help with?</Label>
          <Controller
            control={control}
            name="interest"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="interest" aria-invalid={!!errors.interest}>
                  <SelectValue placeholder="Select an area of interest" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.interest?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
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

        <label className="flex cursor-pointer items-start gap-3 text-sm text-mist">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-hairline-strong bg-white/3 accent-violet"
            {...register("agree")}
          />
          <span>
            I agree to the{" "}
            <Link href="/" className="text-violet-bright hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/" className="text-violet-bright hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <FieldError message={errors.agree?.message} />

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : (
            "Create member account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-mist">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-violet-bright hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export function RegisterSuccess({ role }: { role: "member" | "expert" }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-violet/15 text-violet-bright">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h3 className="text-2xl font-bold text-cloud">
        {role === "expert" ? "Application received" : "Welcome to Hubology"}
      </h3>
      <p className="max-w-sm text-sm text-mist">
        {role === "expert"
          ? "Thanks for applying. Our team reviews every expert profile manually — we will be in touch shortly."
          : "Your account is ready. Explore services and connect with verified experts."}
      </p>
      <Button asChild className="mt-2">
        <Link href={role === "expert" ? "/" : "/services"}>
          {role === "expert" ? "Back to home" : "Browse services"}
        </Link>
      </Button>
    </div>
  );
}
