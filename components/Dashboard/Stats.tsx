import React from "react";
import classnames from "classnames";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type Props = {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
  unit?: string;
  value: number | string;
  additionalInfo?: {
    icon: IconDefinition;
    onClick: () => void;
  };
};
export default function Stats({
  title,
  value,
  unit,
  centered,
  additionalInfo,
  subtitle,
  className,
}: Props) {
  const shouldRoundValue =
    !Number.isInteger(value) && typeof value === "number";
  const displayValue = shouldRoundValue ? (value as number).toFixed(2) : value;
  return (
    <div
      className={classnames(
        "stat",
        centered && "place-items-center place-content-center",
        className
      )}
    >
      {additionalInfo && (
        <div
          className="stat-figure text-accent"
          onClick={additionalInfo.onClick}
        >
          <FontAwesomeIcon icon={additionalInfo.icon} className="text-accent" />
        </div>
      )}
      <div className="stat-title">{title}</div>
      <div className="stat-value text-md">
        {displayValue}
        {unit}
      </div>
      {subtitle && <div className="stat-desc">{subtitle}</div>}
    </div>
  );
}
