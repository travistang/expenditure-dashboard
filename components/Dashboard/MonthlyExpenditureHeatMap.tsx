import React from "react";
import { ExpenditureRecord } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { expenditureOfEachDay } from "../../domain/expenditureOfDays";
import Heatmap from "../Heatmap";

type Props = {
  records: ExpenditureRecord[];
  date: Date;
  className?: string;
};
export default function MonthlyExpenditureHeatMap({
  records,
  date,
  className,
}: Props) {
  const fromDate = startOfMonth(date);
  const toDate = endOfMonth(date);
  const expenditureHistogram = expenditureOfEachDay({
    fromDate,
    toDate,
    records,
  });
  const values = Object.entries(expenditureHistogram).map(
    ([date, eachDayData]) => ({
      date,
      count: eachDayData.amount,
    })
  );
  return (
    <div className={className}>
      <span className="stat-title">Expenditure Heatmap</span>
      <Heatmap fromDate={fromDate} toDate={toDate} values={values} />
    </div>
  );
}
