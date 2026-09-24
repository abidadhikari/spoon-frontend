import FormItemWrapper from "@/components/molecules/FormInputWrapper";
import { Input } from "@/components/ui/input";
import type { IBaseInput } from "@/types/input.type";
import type { FieldValues } from "react-hook-form";

type FormCheckboxItemProps<T extends FieldValues> = Omit<
  IBaseInput<T>,
  "placeholder" | "onChange" | "onKeyDown"
> & {
  disabled?: boolean;
};

export default function FormCheckboxItem<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled = false,
}: FormCheckboxItemProps<T>) {
  return (
    <FormItemWrapper
      control={control}
      name={name}
      label={undefined}
      required={required}
    >
      {(field) => (
        <label className="flex items-center gap-2">
          <Input
            type="checkbox"
            checked={Boolean(field.value)}
            disabled={disabled}
            onChange={(event) => field.onChange(event.target.checked)}
            className="size-4 accent-primary"
          />
          <span className="text-sm font-medium">{label}</span>
        </label>
      )}
    </FormItemWrapper>
  );
}
