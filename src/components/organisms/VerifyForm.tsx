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
import { useVerifyUser } from "@/hooks/services/auth/useVerifyUser";

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(4, "Enter the code sent to your email"),
});

type VerifySchemaType = z.infer<typeof verifySchema>;

export function VerifyForm({
  email: defaultEmail,
  className,
  ...props
}: React.ComponentProps<"div"> & { email?: string }) {
  const navigate = useRouter();
  const { mutateAsync, isPending } = useVerifyUser();

  const { control, handleSubmit } = useForm<VerifySchemaType>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: defaultEmail ?? "",
      otp: "",
    },
  });

  const onSubmit = async (values: VerifySchemaType) => {
    await mutateAsync({
      email: values.email,
      otp: values.otp,
    });
    navigate.push("/login");
  };

  return (
    <Card className={cn("w-full max-w-sm", className)} {...props}>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          Enter the verification code sent to your email address
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              name="otp"
              label="Verification code"
              placeholder="000000"
              type="text"
            />

            <Field>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Verifying..." : "Verify"}
              </Button>
              <FieldDescription className="text-center">
                After verifying, you can log in with your credentials.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
