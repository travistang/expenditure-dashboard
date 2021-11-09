import React from "react";
import { useQuery } from "@apollo/client";
import { ExpenditureRecord } from "@prisma/client";
import { format, startOfMonth, endOfMonth } from "date-fns";

import { EXPENDITURE_OF_MONTH } from "./queries";

type LabelStatistics = {
  label: string;
  count: number;
  total: number;
};
type LabelStatisticsMap = {
  [label: string]: LabelStatistics;
};
type MonthlyExpenditureAggregationType = {
  totalExpenditure: number;
  numberOfRecords: number;
  numberOfDistinctLabels: number;
  labelStatistics: LabelStatisticsMap;
  mostExpenditureLabels?: LabelStatistics;
};
export default function useMonthlyExpenditureAggregation(): MonthlyExpenditureAggregationType {
  const now = new Date();
  const startDate = format(startOfMonth(now), "yyyy-MM-dd");
  const endDate = format(endOfMonth(now), "yyyy-MM-dd");
  const { data } = useQuery<{
    expenditureRecords: ExpenditureRecord[];
  }>(EXPENDITURE_OF_MONTH, { variables: { startDate, endDate } });

  const expenditureRecords = data?.expenditureRecords ?? [];

  const allLabels = expenditureRecords.flatMap((record) => record.labels);
  const labelStatistics: LabelStatisticsMap = expenditureRecords.reduce(
    (stat, record) => {
      return record.labels.reduce((statWithLabels, label) => {
        return {
          ...statWithLabels,
          [label]: {
            label,
            count: (statWithLabels[label]?.count ?? 0) + 1,
            total: (statWithLabels[label]?.total ?? 0) + record.amount,
          },
        };
      }, stat);
    },
    {}
  );
  return {
    totalExpenditure: expenditureRecords?.reduce(
      (total, record) => record.amount + total,
      0
    ),
    numberOfRecords: expenditureRecords?.length ?? 0,
    numberOfDistinctLabels: Array.from(new Set(allLabels)).length,
    labelStatistics,
    mostExpenditureLabels: Object.values(labelStatistics).sort(
      (statA, statB) => statB.total - statA.total
    )[0],
  };
}
