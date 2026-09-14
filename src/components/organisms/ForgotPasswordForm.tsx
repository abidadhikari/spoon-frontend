"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import { useForgotPassword } from "@/hooks/services/auth/useForgotPassword";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

function extractErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";
  if (typeof error === "object" && error !== null) {
    const detail = (error as { response?: { data?: { detail?: string } } })
      ?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    const msg = (error as { message?: string })?.message;
    if (typeof msg === "string" && msg.toLowerCase().includes("network"))
      return "Unable to connect. Please check your connection and try again.";
  }
  return "Something went wrong. Please try again.";
}

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    mutate,
    isPending,
    error,
    reset: resetMutation,
  } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: ForgotFormValues) => {
    resetMutation();
    mutate(
      { email: values.email },
      {
        onSuccess: () => setSubmittedEmail(values.email),
      },
    );
  };

  const isLoading = isPending || isSubmitting;
  const apiErrorMessage = error ? extractErrorMessage(error) : null;

  // Success state — show confirmation without exposing whether account exists
  if (submittedEmail) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            Instructions sent if an account exists
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 px-5 py-5 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--brand)" }}
              aria-hidden="true"
            >
              <Mail
                className="size-4"
                style={{ color: "var(--brand-foreground)" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                Reset code sent
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If an account is associated with{" "}
                <span className="font-medium text-foreground">
                  {submittedEmail}
                </span>
                , you&apos;ll receive a password reset code shortly.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() =>
            (window.location.href = `/reset-password?email=${encodeURIComponent(submittedEmail)}`)
          }
          className="w-full h-9"
          style={{
            background: "var(--brand)",
            color: "var(--brand-foreground)",
          }}
        >
          Enter reset code
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset code
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <FormInputItem
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
            required
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
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
              style={{
                background: isLoading ? undefined : "var(--brand)",
                color: isLoading ? undefined : "var(--brand-foreground)",
              }}
            >
              {isLoading ? "Sending…" : "Send reset code"}
            </Button>
          </Field>

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
