import React from "react";
import classnames from "classnames";
import { DocumentNode, gql, useQuery } from "@apollo/client";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
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
  additionalInfo,
  subtitle,
  className,
}: Props) {
  const shouldRoundValue =
    !Number.isInteger(value) && typeof value === "number";
  const displayValue = shouldRoundValue ? (value as number).toFixed(2) : value;
  return (
    <div className={classnames("stat", className)}>
      {additionalInfo && (
        <div
          className="stat-figure text-accent"
          onClick={additionalInfo.onClick}
        >
          <FontAwesomeIcon icon={additionalInfo.icon} className="text-accent" />
        </div>
      )}
      <div className="stat-title">{title}</div>
      <div className="stat-value">
        {displayValue}
        {unit}
      </div>
      {subtitle && <div className="stat-desc">{subtitle}</div>}
    </div>
  );
}
