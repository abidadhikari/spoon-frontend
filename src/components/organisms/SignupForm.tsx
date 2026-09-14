"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import { useRegister } from "@/hooks/services/auth/useRegister";

const signupSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().optional(),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

function extractErrorMessage(error: unknown): string {
  if (!error) return "Failed to create account. Please try again.";
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
  return "Failed to create account. Please try again.";
}

export function SignupForm() {
  const router = useRouter();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const { mutate, isPending, error, reset: resetMutation } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: SignupFormValues) => {
    resetMutation();
    mutate(
      {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name || undefined,
        password: values.password,
      },
      {
        onSuccess: () => {
          setRegisteredEmail(values.email);
        },
      },
    );
  };

  const isLoading = isPending || isSubmitting;
  const apiErrorMessage = error ? extractErrorMessage(error) : null;

  // Success state
  if (registeredEmail) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            Account created successfully
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 px-5 py-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle
              className="size-5 shrink-0"
              style={{ color: "var(--brand)" }}
            />
            <span className="text-sm font-medium text-foreground">
              Verification email sent
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We&apos;ve sent a 6-digit verification code to{" "}
            <span className="font-medium text-foreground">
              {registeredEmail}
            </span>
            . Enter it on the next screen to activate your account.
          </p>
        </div>

        <Button
          onClick={() =>
            router.push(`/verify?email=${encodeURIComponent(registeredEmail)}`)
          }
          className="w-full h-9"
          style={{
            background: "var(--brand)",
            color: "var(--brand-foreground)",
          }}
        >
          Verify account
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Get started with Spoon for free
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <FormInputItem
              control={control}
              name="first_name"
              label="First name"
              placeholder="Jane"
              type="text"
              required
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <FormInputItem
              control={control}
              name="last_name"
              label="Last name"
              placeholder="Doe"
              type="text"
            />
          </div>

          <FormInputItem
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
            required
          />

          <div className="flex flex-col gap-1.5">
            <FormInputItem
              control={control}
              name="password"
              label="Password"
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
            label="Confirm password"
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
              style={{
                background: isLoading ? undefined : "var(--brand)",
                color: isLoading ? undefined : "var(--brand-foreground)",
              }}
            >
              {isLoading ? "Creating account…" : "Create account"}
            </Button>
            <FieldDescription className="text-center text-xs">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
