import {
  Controller,
  type FieldValues,
  type Path,
  type Control,
  ControllerRenderProps,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { IBaseInput } from "@/types/input.type";
// import LimitRenderer from "./LimitRenderer/LimitRenderer";

interface FormItemWrapperProps<T extends FieldValues> extends IBaseInput<T> {
  children: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
}

export default function FormItemWrapper<T extends FieldValues>({
  control,
  name,
  label,
  required,
  children,
  limitRenderer,
}: FormItemWrapperProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="flex flex-col gap-1">
          {label && (
            <FieldLabel>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </FieldLabel>
          )}

          {children(field)}

          {limitRenderer ? (
            <div className="flex justify-between items-start">
              <FieldError>{fieldState.error?.message}</FieldError>

              {/* <LimitRenderer
                content={field.value}
                limit={limitRenderer.limit}
                className={cn("flex-1", limitRenderer.className)}
              /> */}
            </div>
          ) : (
            <FieldError>{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
