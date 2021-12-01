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

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentMonthString = format(selectedDate, "MMM yyyy");
  const { records } = useMonthlyExpenditure(selectedDate);

  return (
    <div className="grid grid-cols-6 md:grid-cols-12 md:p-4 gap-4">
      <InputBase
        name="date"
        label=""
        type="month"
        className="col-end-13 col-span-5 md:col-start-10 mr-2"
        value={format(selectedDate, "yyyy-MM")}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />
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
