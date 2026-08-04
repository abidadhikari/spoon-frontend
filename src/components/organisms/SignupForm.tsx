"use client";

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
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import { useRegister } from "@/hooks/services/auth/useRegister";
import Link from "next/link";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupSchemaType = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useRouter();
  const { mutateAsync, isPending } = useRegister();

  const { control, handleSubmit } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupSchemaType) => {
    await mutateAsync({
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name || undefined,
      password: values.password,
    });
    navigate.push(`/verify?email=${encodeURIComponent(values.email)}`);
  };

  return (
    <Card className={cn("w-full max-w-sm", className)} {...props}>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter your details below to sign up
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInputItem
              control={control}
              name="first_name"
              label="First name"
              placeholder="John"
              type="text"
            />

            <FormInputItem
              control={control}
              name="last_name"
              label="Last name"
              placeholder="Doe"
              type="text"
            />

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

            <Field>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Creating account..." : "Sign up"}
              </Button>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link href="/login">Log in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
