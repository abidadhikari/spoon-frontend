"use client";

import { useEffect, useMemo } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreatableCombobox } from "@/components/CreatableCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    pricing_type: z.enum(["FIXED", "VARIABLE"]),
    is_visible: z.boolean(),
    prices: z
      .array(
        z.object({
          label: z.string().trim().min(1, "Label is required"),
          price: z.coerce
            .number()
            .min(0, "Price must be greater than or equal to 0"),
        }),
      )
      .min(1),
  })
  .superRefine((values, ctx) => {
    if (values.pricing_type !== "VARIABLE") {
      return;
    }

    const seenLabels = new Map<string, number>();

    values.prices.forEach((price, index) => {
      const normalizedLabel = price.label.trim().toLowerCase();

      if (!normalizedLabel) {
        return;
      }

      const firstIndex = seenLabels.get(normalizedLabel);

      if (firstIndex !== undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Variable prices cannot have duplicate labels",
          path: ["prices", index, "label"],
        });
        ctx.addIssue({
          code: "custom",
          message: "Variable prices cannot have duplicate labels",
          path: ["prices", firstIndex, "label"],
        });
        return;
      }

      seenLabels.set(normalizedLabel, index);
    });
  });

export type MenuItemFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: MenuItemFormValues;
  existingLabels?: string[];
  loading?: boolean;
  onSubmit: (values: MenuItemFormValues) => void | Promise<void>;
};

export default function MenuItemForm({
  defaultValues,
  existingLabels = [],
  loading,
  onSubmit,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      pricing_type: "FIXED",
      is_visible: true,
      prices: [
        {
          label: "Fixed",
          price: 0,
        },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "prices",
  });

  const pricingType = useWatch({ control, name: "pricing_type" });
  const prices = useWatch({ control, name: "prices" }) ?? [];
  const selectedLabels = useMemo(
    () =>
      prices
        .map((price) => price.label.trim())
        .filter(Boolean),
    [prices],
  );
  const labelOptions = useMemo(
    () =>
      Array.from(
        new Map(
          [...existingLabels, ...selectedLabels]
            .map((label) => label.trim())
            .filter(Boolean)
            .map((label) => [label.toLowerCase(), label]),
        ).values(),
      ),
    [existingLabels, selectedLabels],
  );

  useEffect(() => {
    if (pricingType !== "FIXED") {
      return;
    }

    const currentPrices = getValues("prices");
    const firstPrice = currentPrices[0];
    const fixedPrice = {
      label: "Fixed",
      price: firstPrice?.price ?? 0,
    };

    if (
      currentPrices.length !== 1 ||
      currentPrices[0]?.label !== "Fixed" ||
      currentPrices[0]?.price !== fixedPrice.price
    ) {
      replace([fixedPrice]);
      return;
    }

    setValue("prices.0.label", "Fixed", {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [getValues, pricingType, replace, setValue]);

  const submitForm = (values: MenuItemFormValues) => {
    if (values.pricing_type === "FIXED") {
      const firstPrice = values.prices[0];

      return onSubmit({
        ...values,
        prices: [
          {
            label: "Fixed",
            price: firstPrice?.price ?? 0,
          },
        ],
      });
    }

    return onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <div>
        <Label>Name</Label>

        <Input {...register("name")} />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label>Description</Label>

        <Textarea rows={4} {...register("description")} />
      </div>

      <div>
        <Label>Pricing Type</Label>

        <input type="hidden" {...register("pricing_type")} />

        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["FIXED", "VARIABLE"] as const).map((type) => (
            <Button
              key={type}
              type="button"
              variant={pricingType === type ? "default" : "outline"}
              onClick={() =>
                setValue("pricing_type", type, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input id="visible" type="checkbox" {...register("is_visible")} />

        <Label htmlFor="visible">Visible</Label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Prices</Label>

          {pricingType === "VARIABLE" && (
            <Button
              type="button"
              onClick={() =>
                append({
                  label: "",
                  price: 0,
                })
              }
            >
              Add Price
            </Button>
          )}
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3">
            {pricingType === "VARIABLE" && (
              <div className="flex-1">
                <Controller
                  control={control}
                  name={`prices.${index}.label`}
                  render={({ field }) => (
                    <CreatableCombobox
                      value={field.value}
                      options={labelOptions}
                      disabledOptions={selectedLabels.filter(
                        (label) =>
                          label.trim().toLowerCase() !==
                          field.value.trim().toLowerCase(),
                      )}
                      placeholder="Select label"
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.prices?.[index]?.label && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.prices[index]?.label?.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex-1">
              <Input
                type="number"
                min={0}
                placeholder="Price"
                {...register(`prices.${index}.price`)}
              />

              {errors.prices?.[index]?.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.prices[index]?.price?.message}
                </p>
              )}
            </div>

            {pricingType === "VARIABLE" && fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}

        {errors.prices?.root && (
          <p className="text-sm text-red-500">Please enter valid prices.</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
