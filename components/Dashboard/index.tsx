import React from "react";
import { format } from "date-fns";

import useMonthlyExpenditure from "./useMonthlyExpenditure";
import CommonExpenditureWidget from "./CommonExpenditureWidget";
import * as ExpenditureStatistics from "../../domain/expenditureStatistics";
import MostExpenditureLabelStats from "./MostExpenditureLabelStats";
import MonthlyExpenditureHeatMap from "./MonthlyExpenditureHeatMap";
import ExpenditurePieChart from "./ExpenditurePieChart";
import { ComputeLabelStatisticsLabelType } from "../../domain/labelStatistics";

export default function Dashboard() {
  const currentMonthString = format(new Date(), "MMM yyyy");
  const date = new Date();
  const { records } = useMonthlyExpenditure(date);

  return (
    <div className="grid grid-cols-6 md:grid-cols-12 md:p-4 gap-4">
      <div className="stats col-span-3 md:col-span-6">
        <CommonExpenditureWidget
          title="Expenditure"
          aggregationFunc={ExpenditureStatistics.total}
          records={records}
          unit="€"
          className="bg-primary"
          subtitle={currentMonthString}
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
      <MostExpenditureLabelStats
        records={records}
        className="grid-flow-row sm:grid-flow-col stats col-span-full overflow-hidden"
      />

      <div className="col-span-full sm:col-span-6 stats">
        <MonthlyExpenditureHeatMap
          records={records}
          date={date}
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
