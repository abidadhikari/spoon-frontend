"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import { useVerifyUser } from "@/hooks/services/auth/useVerifyUser";
import { useResendVerification } from "@/hooks/services/auth/useResendVerification";

const RESEND_COOLDOWN_SECONDS = 60;

const verifySchema = z.object({
  email: z.string().email("Enter a valid email address"),
  otp: z
    .string()
    .min(4, "Enter the verification code")
    .max(12, "Code is too long"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

function extractErrorMessage(error: unknown): string {
  if (!error) return "Verification failed. Please try again.";
  if (typeof error === "object" && error !== null) {
    const detail = (error as { response?: { data?: { detail?: string } } })
      ?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    const msg = (error as { message?: string })?.message;
    if (typeof msg === "string") {
      if (msg.toLowerCase().includes("network"))
        return "Unable to connect. Please check your connection and try again.";
    }
  }
  return "Invalid or expired verification code. Please try again.";
}

export function VerifyForm({ email: defaultEmail }: { email?: string }) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    mutate: verify,
    isPending,
    error,
    reset: resetMutation,
  } = useVerifyUser();
  const { mutate: resend, isPending: isResending } = useResendVerification();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: defaultEmail ?? "", otp: "" },
    mode: "onTouched",
  });

  const emailValue = watch("email");

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = (values: VerifyFormValues) => {
    resetMutation();
    verify(
      { email: values.email, otp: values.otp },
      {
        onSuccess: () => setVerified(true),
      },
    );
  };

  const handleResend = useCallback(() => {
    if (!emailValue || cooldown > 0 || isResending) return;
    resend(
      { email: emailValue },
      {
        onSuccess: () => setCooldown(RESEND_COOLDOWN_SECONDS),
      },
    );
  }, [emailValue, cooldown, isResending, resend]);

  const isLoading = isPending || isSubmitting;
  const apiErrorMessage = error ? extractErrorMessage(error) : null;

  if (verified) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Email verified
          </h1>
          <p className="text-sm text-muted-foreground">Your account is ready</p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 px-5 py-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle
              className="size-5 shrink-0"
            />
            <span className="text-sm font-medium text-foreground">
              Verification successful
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your email has been verified. You can now sign in to your account.
          </p>
        </div>

        <Button
          onClick={() => router.push("/login")}
          className="w-full h-9"
        >
          Continue to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the code we sent to{" "}
          {defaultEmail ? (
            <span className="font-medium text-foreground">{defaultEmail}</span>
          ) : (
            "your email address"
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {/* Show email field only when not pre-filled from URL */}
          {!defaultEmail && (
            <FormInputItem
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
              required
            />
          )}

          <FormInputItem
            control={control}
            name="otp"
            label="Verification code"
            placeholder="Enter the code from your email"
            type="text"
            required
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={!!defaultEmail}
          />

          {apiErrorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
            >
              {apiErrorMessage}
            </div>
          )}

          <Field>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 text-sm font-medium"
            >
              {isLoading ? "Verifying…" : "Verify email"}
            </Button>
          </Field>

          <FieldDescription className="text-center text-xs">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending || !emailValue}
              className="font-medium text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending
                ? "Sending…"
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend code"}
            </button>
          </FieldDescription>

          <FieldDescription className="text-center text-xs">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to sign in
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
