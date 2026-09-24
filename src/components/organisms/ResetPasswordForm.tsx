"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import { useResetPassword } from "@/hooks/services/auth/useResetPassword";
import { extractApiError } from "@/lib/extractApiError";

const resetSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    otp: z.string().min(1, "Enter the reset code from your email"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  /** Pre-filled from ?email= query param */
  email?: string;
}

export function ResetPasswordForm({
  email: defaultEmail,
}: ResetPasswordFormProps) {
  const [success, setSuccess] = useState(false);
  const { mutate, isPending, error, reset: resetMutation } = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: defaultEmail ?? "",
      otp: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: ResetFormValues) => {
    resetMutation();
    mutate(
      {
        email: values.email,
        otp: values.otp,
        new_password: values.new_password,
      },
      { onSuccess: () => setSuccess(true) },
    );
  };

  const isLoading = isPending || isSubmitting;
  const apiErrorMessage = error ? extractApiError(error, "Something went wrong. Please try again.") : null;

  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Password updated
          </h1>
          <p className="text-sm text-muted-foreground">
            Your account is secured
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 px-5 py-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle
              className="size-5 shrink-0"
            />
            <span className="text-sm font-medium text-foreground">
              Password changed successfully
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your password has been updated. Sign in with your new password.
          </p>
        </div>

        <Link href="/login">
          <Button
            className="w-full h-9"
          >
            Continue to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Set new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the code from your email and choose a new password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {/* Show email field when not pre-filled */}
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
            label="Reset code"
            placeholder="Enter the code from your email"
            type="text"
            required
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />

          <div className="flex flex-col gap-1.5">
            <FormInputItem
              control={control}
              name="new_password"
              label="New password"
              placeholder="••••••••"
              type="password"
              required
            />
            <p className="text-xs text-muted-foreground">
              Min. 8 characters, one uppercase letter, one number
            </p>
          </div>

          <FormInputItem
            control={control}
            name="confirm_password"
            label="Confirm new password"
            placeholder="••••••••"
            type="password"
            required
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
              {isLoading ? "Updating password…" : "Update password"}
            </Button>
          </Field>

          <FieldDescription className="text-center text-xs">
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Request a new code
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
