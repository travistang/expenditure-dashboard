import React from "react";
import classnames from "classnames";

type Props = {
  checked: boolean;
  label: string;
  accent?: "primary" | "warning" | "error";
  onToggle: () => void;
  className?: string;
};

const AccentColorMap: Record<string, string> = {
  primary: "checkbox-primary",
  warning: "checkbox-warning",
  error: "checkbox-error",
};
export default function Checkbox({
  className,
  checked,
  label,
  onToggle,
  accent,
}: Props) {
  return (
    <div
      className={classnames("flex items-center gap-2", className)}
      onClick={onToggle}
    >
      <input
        type="checkbox"
        checked={checked}
        className={classnames("checkbox flex-shrink-0", AccentColorMap[accent])}
      />
      <span className="label-text text-left">{label}</span>
    </div>
  );
}
