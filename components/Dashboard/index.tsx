import React from "react";
import { format } from "date-fns";

import useMonthlyExpenditure from "./useMonthlyExpenditure";
import CommonExpenditureWidget from "./CommonExpenditureWidget";
import * as ExpenditureStatistics from "../../domain/expenditureStatistics";
import MostExpenditureLabelStats from "./MostExpenditureLabelStats";
import MonthlyExpenditureHeatMap from "./MonthlyExpenditureHeatMap";
import ExpenditurePieChart from "./ExpenditurePieChart";
import { ComputeLabelStatisticsLabelType } from "../../domain/labelStatistics";
import { useState } from "react";
import InputBase from "../Form/Input";
import { useQuery } from "@apollo/client";
import { BUDGET_LIST_QUERY } from "../../queries/budgets";
import {
  BudgetWithUsage,
  grossBudgetLimit,
  grossBudgetUsage,
} from "../../domain/budgetUsage";
import Stats from "./Stats";
import { BudgetUsageColor, getBudgetUsageLevel } from "../../constants/budgets";
import BudgetOverviewWidget from "./BudgetOverviewWidget";

type BudgetListQueryResponseType = {
  budgets: BudgetWithUsage[];
};
export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentMonthString = format(selectedDate, "MMM yyyy");
  const { records } = useMonthlyExpenditure(selectedDate);
  const { data: budgetsData } = useQuery<BudgetListQueryResponseType>(
    BUDGET_LIST_QUERY,
    {
      variables: { date: selectedDate },
    }
  );
  const budgets = budgetsData?.budgets ?? [];
  const grossUsage = grossBudgetUsage(budgets);
  const budgetLimit = grossBudgetLimit(budgets);
  const usagePercentage = grossUsage / (budgetLimit || 1);
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 md:p-4 gap-4 overflow-y-auto">
      <InputBase
        name="date"
        label=""
        type="month"
        className="sticky top-0 col-span-full md:col-start-9 md:col-end-13 mr-2"
        value={format(selectedDate, "yyyy-MM")}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />
      <div className="stats col-span-3 sm:col-span-full md:col-span-3">
        <CommonExpenditureWidget
          title="Expenditure"
          aggregationFunc={ExpenditureStatistics.total}
          records={records}
          unit="€"
          className="bg-primary"
          subtitle={currentMonthString}
        />
      </div>
      <div className="stats col-span-3 sm:col-span-full md:col-span-3">
        <Stats
          title="Gross Budget Usage"
          value={usagePercentage * 100}
          unit="%"
          className={
            BudgetUsageColor[getBudgetUsageLevel(usagePercentage)].background
          }
          subtitle={`Used: ${grossUsage.toFixed(2)}€`}
        />
      </div>
      <div className="stats col-span-3 md:col-span-6">
        <CommonExpenditureWidget
          title="Number of records"
          records={records}
          aggregationFunc={ExpenditureStatistics.count}
          subtitle={currentMonthString}
        />
      </div>
      <BudgetOverviewWidget budgets={budgetsData?.budgets ?? []} />
      <MostExpenditureLabelStats
        records={records}
        className="grid-flow-row sm:grid-flow-col stats col-span-full overflow-hidden"
      />

      <div className="col-span-full sm:col-span-6 stats">
        <MonthlyExpenditureHeatMap
          records={records}
          date={selectedDate}
          className="flex flex-col items-start rounded-lg bg-base-100 p-4 h-72"
        />
      </div>
      <div className="col-span-6 stats">
        <ExpenditurePieChart
          records={records}
          labelType={ComputeLabelStatisticsLabelType.GENERAL_LABELS}
          className="flex flex-col items-start rounded-lg bg-base-100 p-4 h-72"
        />
      </div>
      <div className="col-span-6 stats">
        <ExpenditurePieChart
          records={records}
          labelType={ComputeLabelStatisticsLabelType.SPECIFIC_LABELS}
          className="flex flex-col items-start rounded-lg bg-base-100 p-4 h-72"
        />
      </div>
    </div>
  );
}
