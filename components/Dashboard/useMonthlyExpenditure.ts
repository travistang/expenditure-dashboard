import { useQuery } from "@apollo/client";
import { ExpenditureRecord } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";
import { yyyyMMdd } from "../../utils/dates";

import { EXPENDITURE_OF_MONTH } from "./queries";

export type MonthlyExpenditureAggregationType = {
  records: ExpenditureRecord[];
  loading: boolean;
};
export default function useMonthlyExpenditure(
  date = new Date()
): MonthlyExpenditureAggregationType {
  const startDate = yyyyMMdd(startOfMonth(date));
  const endDate = yyyyMMdd(endOfMonth(date));
  const { data, loading } = useQuery<{
    expenditureRecords: ExpenditureRecord[];
  }>(EXPENDITURE_OF_MONTH, { variables: { startDate, endDate } });

  const records = data?.expenditureRecords ?? [];
  return {
    records,
    loading,
  };
}
