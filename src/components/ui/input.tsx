import {
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from "react";

export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

/**
 * A DaisyUI-styled label for form inputs.
 * @see https://daisyui.com/components/label/
 */
export function Label({ children, htmlFor, className = "" }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`label ${className}`}>
      <span className="label-text">{children}</span>
    </label>
  );
}

type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  size?: InputSize;
  error?: boolean;
}

const inputSizeClasses: Record<InputSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

/**
 * A DaisyUI-styled input field.
 * @see https://daisyui.com/components/input/
 *
 * @example
 *   <Input label="Email" type="email" placeholder="you@example.com" />
 */
export function Input({
  label,
  size = "md",
  error = false,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const sizeClass = inputSizeClasses[size];

  return (
    <div className="form-control w-full">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <input
        id={inputId}
        className={`input w-full ${sizeClass} ${error ? "input-error" : ""} ${className}`}
        {...props}
      />
    </div>
  );
}
