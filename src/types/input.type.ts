import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

export interface IBaseInput<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  limitRenderer?: {
    limit: number;
    className?: string;
  };
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<T, Path<T>>,
  ) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
