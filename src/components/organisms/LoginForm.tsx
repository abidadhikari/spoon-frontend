"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import { useLogin } from "@/hooks/services/auth/useLogin";
import { useGetMe } from "@/hooks/services/auth/useGetMe";
import { extractApiError } from "@/lib/extractApiError";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useGetMe();
  const { mutate, isPending, error, reset: resetMutation } = useLogin();

  // Redirect already-authenticated users away
  useEffect(() => {
    if (!isCheckingAuth && user) {
      router.replace("/dashboard");
    }
  }, [user, isCheckingAuth, router]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: LoginFormValues) => {
    resetMutation();
    mutate(
      { username: values.email, password: values.password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  };

  const isLoading = isPending || isSubmitting;
  const apiErrorMessage = error
    ? extractApiError(error, "Invalid credentials. Please try again.")
    : null;

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your Spoon account
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
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />

          <div className="flex flex-col gap-1.5">
            <FormInputItem
              control={control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* API error */}
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
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
            <FieldDescription className="text-center text-xs">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
