import React from "react";
import { ExpenditureRecord } from "@prisma/client";

import * as ExpenditureStatisticsDomain from "../../../../domain/expenditureStatistics";
import withWidgetShell from "../WidgetShell";
import BudgetStatsItem from "./BudgetStatsItem";

type Props = {
  budgetAmount?: number;
  records?: ExpenditureRecord[];
  sum?: number;
};
function BudgetStats({ sum, budgetAmount, records }: Props) {
  const average = ExpenditureStatisticsDomain.average(records);
  const count = ExpenditureStatisticsDomain.count(records);
  const usedPercentage = (sum / budgetAmount) * 100;

  return (
    <>
      <span className="stat-title pb-4">Statistics</span>
      <div className="flex px-2 h-24 items-center border-base-100">
        <span className="text-6xl font-bold">{usedPercentage.toFixed(2)}%</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <BudgetStatsItem label="Budget" value={budgetAmount} isMoney />
        <BudgetStatsItem label="Spent" value={sum} isMoney />
        <BudgetStatsItem label="Average Expenditure" value={average} isMoney />
        <BudgetStatsItem label="Number of records" value={count} />
      </div>
    </>
  );
}

export default withWidgetShell(BudgetStats);
