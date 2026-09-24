import FormItemWrapper from "@/components/molecules/FormInputWrapper";
import type { IBaseInput } from "@/types/input.type";
import type { FieldValues } from "react-hook-form";

type SelectOption = {
  label: string;
  value: string;
};

type FormSelectItemProps<T extends FieldValues> = Omit<
  IBaseInput<T>,
  "onChange" | "onKeyDown"
> & {
  options: SelectOption[];
  disabled?: boolean;
};

export default function FormSelectItem<T extends FieldValues>({
  control,
  name,
  label,
  required,
  options,
  disabled = false,
}: FormSelectItemProps<T>) {
  return (
    <FormItemWrapper
      control={control}
      name={name}
      label={label}
      required={required}
    >
      {(field) => (
        <select
          {...field}
          value={field.value ?? ""}
          disabled={disabled}
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FormItemWrapper>
  );
}
