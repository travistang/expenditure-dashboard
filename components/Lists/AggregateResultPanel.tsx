import React from "react";
import classnames from "classnames";

type Props = {
  count: number;
  sum: number;
  average: number;
  min: number;
  max: number;
};

type StatisticsItemConfig = {
  title: string;
  unit?: string;
  color?: string;
  isInt?: boolean;
};
const StatisticsItemTitle: Record<keyof Props, StatisticsItemConfig> = {
  count: {
    unit: "",
    title: "Number of records",
    isInt: true,
  },
  sum: { title: "Total", unit: "€" },
  average: { title: "Average", unit: "€", color: "text-primary" },
  min: { title: "Min", unit: "€" },
  max: { title: "Max", unit: "€" },
};

export default function AggregateResultPanel(props: Props) {
  return (
    <div className="flex stats w-full">
      {Object.entries(props).map(([key, value]) => (
        <div key={key} className="stat">
          <div className="stat-title">{StatisticsItemTitle[key].title}</div>
          <div
            className={classnames(
              "stat-value text-lg",
              StatisticsItemTitle[key].color
            )}
          >
            {StatisticsItemTitle[key]?.isInt ? value : value.toFixed(2)}
            {StatisticsItemTitle[key].unit ?? ""}
          </div>
        </div>
      ))}
    </div>
  );
}
