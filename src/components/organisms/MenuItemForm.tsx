"use client";

import { useMemo, useRef } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreatableCombobox } from "@/components/CreatableCombobox";
import FormTextareaItem from "@/components/molecules/FormTextareaItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    resolver: zodResolver(schema) as Resolver<MenuItemFormValues>,
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

  const fixedPriceRef = useRef({
    label: "Fixed",
    price: defaultValues?.prices?.[0]?.price ?? 0,
  });
  const variablePricesRef = useRef<MenuItemFormValues["prices"]>(
    defaultValues?.pricing_type === "VARIABLE" ? defaultValues.prices : [],
  );

  const pricingType = useWatch({ control, name: "pricing_type" });
  const prices = useWatch({ control, name: "prices", defaultValue: [] });
  const selectedLabels = useMemo(
    () => prices.map((price) => price.label.trim()).filter(Boolean),
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

  const handlePricingTypeChange = (nextPricingType: "FIXED" | "VARIABLE") => {
    if (nextPricingType === pricingType) {
      return;
    }

    const currentPrices = getValues("prices");

    if (nextPricingType === "FIXED") {
      variablePricesRef.current = currentPrices;
      fixedPriceRef.current = {
        label: "Fixed",
        price: currentPrices[0]?.price ?? fixedPriceRef.current.price,
      };
      replace([fixedPriceRef.current]);
    } else {
      fixedPriceRef.current = {
        label: "Fixed",
        price: currentPrices[0]?.price ?? fixedPriceRef.current.price,
      };
      const variablePrices = variablePricesRef.current.length
        ? variablePricesRef.current
        : [{ label: "", price: fixedPriceRef.current.price }];
      replace(variablePrices);
    }

    setValue("pricing_type", nextPricingType, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

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

      <FormTextareaItem
        control={control}
        name="description"
        label="Description"
        rows={4}
      />

      <div>
        <Label>Pricing Type</Label>

        <input type="hidden" {...register("pricing_type")} />

        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["FIXED", "VARIABLE"] as const).map((type) => (
            <Button
              key={type}
              type="button"
              variant={pricingType === type ? "default" : "outline"}
              onClick={() => handlePricingTypeChange(type)}
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
