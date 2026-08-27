"use client";

import { Textarea } from "@/components/ui/textarea";
import FormItemWrapper from "@/components/molecules/FormInputWrapper";
import { cn } from "@/lib/utils";
import { IBaseInput } from "@/types/input.type";
import { FieldValues, ControllerRenderProps, Path } from "react-hook-form";

interface FormTextareaItemProps<T extends FieldValues> extends Omit<
  IBaseInput<T>,
  "onChange" | "onKeyDown"
> {
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: ControllerRenderProps<T, Path<T>>,
  ) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function FormTextareaItem<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  limitRenderer,
  rows,
  maxLength,
  disabled = false,
  className,
  onChange,
  onKeyDown,
}: FormTextareaItemProps<T>) {
  return (
    <FormItemWrapper
      control={control}
      name={name}
      label={label}
      required={required}
      limitRenderer={limitRenderer}
    >
      {(field) => (
        <Textarea
          {...field}
          value={field.value ?? ""}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          onKeyDown={onKeyDown}
          className={cn(className)}
          onChange={(e) => (onChange ? onChange(e, field) : field.onChange(e))}
        />
      )}
    </FormItemWrapper>
  );
}
