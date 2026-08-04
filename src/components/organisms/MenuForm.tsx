"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const menuSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().optional(),
  is_visible: z.boolean(),
});

export type MenuFormValues = z.infer<typeof menuSchema>;

type Props = {
  defaultValues?: Partial<MenuFormValues>;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: MenuFormValues) => void | Promise<void>;
};

export function MenuForm({
  defaultValues,
  loading,
  submitLabel = "Save",
  onSubmit,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "",
      description: "",
      is_visible: true,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <FormInputItem
          control={control}
          name="name"
          label="Name"
          placeholder="e.g. Main Menu"
        />

        <div>
          <Label>Description</Label>
          <Textarea rows={3} {...register("description")} />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("is_visible")} />
          <Label>Visible</Label>
        </label>

        <Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </Button>
          <FieldDescription>
            Visible menus are published for customers to scan.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
