"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import FormTextareaItem from "@/components/molecules/FormTextareaItem";

const restaurantSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  alias: z.string().trim().min(1, "Alias is required"),
  description: z.string().optional(),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;

type Props = {
  defaultValues?: Partial<RestaurantFormValues>;
  showAlias?: boolean;
  loading?: boolean;
  onSubmit: (values: RestaurantFormValues) => void | Promise<void>;
};

export function RestaurantForm({
  defaultValues,
  showAlias = true,
  loading,
  onSubmit,
}: Props) {
  const { control, handleSubmit } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: "",
      alias: "",
      description: "",
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
          placeholder="e.g. Spoon Downtown"
        />

        {showAlias && (
          <FormInputItem
            control={control}
            name="alias"
            label="Alias"
            placeholder="e.g. spoon-downtown"
          />
        )}

        <FormTextareaItem
          control={control}
          name="description"
          label="Description"
          rows={3}
        />

        <Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <FieldDescription>
            The alias is used to identify the restaurant publicly.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
