"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FormInputItem from "@/components/molecules/FormInputItem";

// 1. Define the validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 2. Infer types from schema
type LoginSchemaType = z.infer<typeof loginSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3. Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 4. API request using form values
  const onSubmit = async (values: LoginSchemaType) => {
    try {
      setErrorMessage(null);
      const formData = new FormData();
      // Backend expects 'username' key for your login flow
      formData.append("username", values.email);
      formData.append("password", values.password);

      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or server error.");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);

      navigate.push("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  };

  return (
    <Card className={cn("w-full max-w-sm", className)} {...props}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 5. Attach handleSubmit to form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInputItem
              control={control}
              name="email"
              label="Email"
              placeholder="m@example.com"
              type="email"
            />

            <FormInputItem
              control={control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
            />

            {/* Global API error notification */}
            {errorMessage && (
              <p className="text-sm font-medium text-destructive text-center">
                {errorMessage}
              </p>
            )}

            <Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => {
                  onSubmit({
                    email: "user@example.com",
                    password: "string",
                  });
                }}
              >
                Login with Google
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Sign up</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
