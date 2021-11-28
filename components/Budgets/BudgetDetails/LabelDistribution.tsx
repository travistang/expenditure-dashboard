import { ExpenditureRecord } from "@prisma/client";
import React from "react";
import {
  computeLabelStatistics,
  labelStatisticsSortedByMostExpenditure,
} from "../../../domain/labelStatistics";
import PieChart from "../../PieChart";
import withWidgetShell from "./WidgetShell";

type Props = {
  records: ExpenditureRecord[];
  includedBudgetLabels: string[];
};
function LabelDistribution({ includedBudgetLabels, records }: Props) {
  const stats = computeLabelStatistics(records);
  const sortedEntries = labelStatisticsSortedByMostExpenditure(stats);
  const data = sortedEntries
    .filter(([label]) => !includedBudgetLabels.includes(label))
    .slice(0, 5)
    .map(([label, data]) => ({
      id: label,
      value: data.total,
    }));
  return (
    <>
      <span className="stat-title pb-4">Expenditure by other labels</span>
      <PieChart data={data} />
    </>
  );
}

export default withWidgetShell(LabelDistribution);
