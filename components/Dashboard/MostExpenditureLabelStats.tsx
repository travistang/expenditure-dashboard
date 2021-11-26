import React from "react";
import { ExpenditureRecord } from "@prisma/client";
import * as LabelStatistics from "../../domain/labelStatistics";
import Stats from "./Stats";

type Props = {
  records: ExpenditureRecord[];
  className?: string;
};
export default function MostExpenditureLabelStats({
  records,
  className,
}: Props) {
  const [label, stats] =
    LabelStatistics.labelStatisticsWithMostExpenditure(
      LabelStatistics.computeLabelStatistics(records)
    ) ?? [];

  if (!label) return null;
  return (
    <div className={className}>
      <Stats centered title="most spent on" value={label} />
      <Stats centered title="Amount" value={stats.total} unit="€" />
      <Stats centered title="Number of records" value={stats.count} />
    </div>
  );
}
