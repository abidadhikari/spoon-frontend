"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import FormTextareaItem from "@/components/molecules/FormTextareaItem";
import { Label } from "@/components/ui/label";

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
  const { control, register, handleSubmit } = useForm<MenuFormValues>({
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

        <FormTextareaItem
          control={control}
          name="description"
          label="Description"
          rows={3}
        />

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
