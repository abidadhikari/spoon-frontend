"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import FormItemWrapper from "@/components/molecules/FormInputWrapper";
import { IBaseInput } from "@/types/input.type";
import { FieldValues } from "react-hook-form";

interface FormInputItemProps<T extends FieldValues> extends IBaseInput<T> {
  showEyeHandler?: boolean;
  type?: "text" | "number" | "email" | "password" | "tel";
  maxLength?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function FormInputItem<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  showEyeHandler = true,
  type = "text",
  maxLength,
  icon,
  onChange,
  onKeyDown,
  limitRenderer,
  disabled = false,
}: FormInputItemProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <FormItemWrapper
      control={control}
      name={name}
      label={label}
      required={required}
      limitRenderer={limitRenderer}
    >
      {(field) => (
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3 inset-y-0 flex items-center">
              {icon}
            </div>
          )}

          <Input
            {...field}
            value={field.value ?? ""}
            type={inputType}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            onKeyDown={onKeyDown}
            className={cn(icon && "pl-10", type === "password" && "pr-10")}
            onChange={(e) =>
              onChange ? onChange(e, field) : field.onChange(e)
            }
          />

          {type === "password" && showEyeHandler && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 inset-y-0 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          )}
        </div>
      )}
    </FormItemWrapper>
  );
}
