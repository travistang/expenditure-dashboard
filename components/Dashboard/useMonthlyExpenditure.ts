import React from "react";
import { useQuery } from "@apollo/client";
import { ExpenditureRecord } from "@prisma/client";
import { format, startOfMonth, endOfMonth } from "date-fns";

import { EXPENDITURE_OF_MONTH } from "./queries";
import {
  computeLabelStatistics,
  LabelStatistics,
  LabelStatisticsMap,
} from "../../domain/labelStatistics";

export type MonthlyExpenditureAggregationType = {
  records: ExpenditureRecord[];
  loading: boolean;
};
export default function useMonthlyExpenditure(
  date = new Date()
): MonthlyExpenditureAggregationType {
  const startDate = format(startOfMonth(date), "yyyy-MM-dd");
  const endDate = format(endOfMonth(date), "yyyy-MM-dd");
  const { data, loading } = useQuery<{
    expenditureRecords: ExpenditureRecord[];
  }>(EXPENDITURE_OF_MONTH, { variables: { startDate, endDate } });

  const records = data?.expenditureRecords ?? [];
  return {
    records,
    loading,
  };
}
