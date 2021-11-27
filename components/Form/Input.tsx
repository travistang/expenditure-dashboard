import React from "react";
import classnames from "classnames";

export type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  onChange: (e: React.ChangeEvent<any>) => void;
  value: string | number;
  type?: string;
  name: string;
  label: string;
  unit?: string;
  error?: string | null;
  className?: string;
  accent?: "primary" | "error";
  bordered?: boolean;
};

export type SpecializedInputProps = Omit<Props, "type">;
const ACCENT_COLOR_MAP: Record<string, string> = {
  primary: "bg-primary",
  error: "bg-error",
};
export default function InputBase({
  onChange,
  value,
  type = "text",
  name,
  label,
  unit,
  error,
  className,
  accent,
  bordered,
  ...props
}: Props) {
  return (
    <div className={classnames("form-control", className)}>
      <label className="label label-text uppercase text-xs">{label}</label>
      <div
        className={classnames(
          "flex items-center rounded-lg",
          ACCENT_COLOR_MAP[accent] ?? ""
        )}
      >
        <input
          type={type}
          name={name}
          className={classnames(
            "flex-1 input w-full",
            unit && "input-ghost",
            bordered && "input-bordered",
            ACCENT_COLOR_MAP[accent] ?? ""
          )}
          onChange={onChange}
          value={value}
          {...props}
        />
        {unit && <span className="w-8">{unit}</span>}
      </div>
      {error && (
        <span className="text-xs text-error">{error}</span>
      )}
    </div>
  );
}

export type TextInput = SpecializedInputProps;
export function TextInput(props: TextInput) {
  return <InputBase type="text" {...props} />;
}
export type NumberInputProps = SpecializedInputProps & {
  min?: number;
  max?: number;
  step?: number;
};
export function NumberInput({
  min = 0,
  max,
  step = 0.01,
  ...props
}: NumberInputProps) {
  return <InputBase type="number" min={min} max={max} step={step} {...props} />;
}
