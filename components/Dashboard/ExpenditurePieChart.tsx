import { ExpenditureRecord } from "@prisma/client";
import {
  computeLabelStatistics,
  ComputeLabelStatisticsLabelType,
  labelStatisticsSortedByMostExpenditure,
} from "../../domain/labelStatistics";
import PieChart from "../PieChart";

type Props = {
  records: ExpenditureRecord[];
  topN?: number;
  labelType: ComputeLabelStatisticsLabelType;
  className?: string;
};
export default function ExpenditurePieChart({
  className,
  records,
  labelType,
  topN = 8,
}: Props) {
  const mostExpensiveEntries = labelStatisticsSortedByMostExpenditure(
    computeLabelStatistics(records, {
      labelType,
    })
  ).slice(0, topN);
  const data = mostExpensiveEntries.map(([label, stat]) => ({
    id: label,
    value: parseFloat(stat.total.toFixed(2)),
  }));
  return (
    <div className={className}>
      <span className="stat-title">Expenditure Distribution</span>
      <PieChart data={data} valueFormat={(value) => `${value.toFixed(2)}€`} />
    </div>
  );
}
