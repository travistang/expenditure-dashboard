import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import "react-calendar-heatmap/dist/styles.css";

const closestN = (num: number, n = 5) => n * Math.floor(num / n);
const clip = (min: number, val: number, max: number) =>
  Math.max(min, Math.min(val, max));

const getClassForValue = (value: { count: number }) => {
  return `text-white fill-current text-opacity-${closestN(
    clip(10, value?.count ?? 0, 100)
  )}`;
};
type Props = {
  values: { date: string; count: number }[];
  fromDate: Date;
  toDate: Date;
};
export default function Heatmap({ values, fromDate, toDate }: Props) {
  const maxValues = values.reduce(
    (max, value) => (value.count < max ? max : value.count),
    -Infinity
  );
  const normalizedValues = values.map((value) => ({
    ...value,
    count: (value.count / (maxValues || 1)) * 100,
  }));
  return (
    <CalendarHeatmap
      values={normalizedValues}
      startDate={fromDate}
      endDate={toDate}
      horizontal={false}
      showMonthLabels={true}
      showWeekdayLabels={true}
      showOutOfRangeDays={false}
      classForValue={getClassForValue}
    />
  );
}
