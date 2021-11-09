import React from "react";
import { format } from "date-fns";

import Stats from "./Stats";
import useMonthlyExpenditureAggregation from "./useMonthlyExpenditureAggregation";

export default function Dashboard() {
  const currentMonthString = format(new Date(), "MMM yyyy");
  const {
    totalExpenditure,
    numberOfRecords,
    numberOfDistinctLabels,
    mostExpenditureLabels,
  } = useMonthlyExpenditureAggregation();

  return (
    <div className="grid grid-cols-12 p-4 gap-4">
      <div className="stats col-span-3">
        <Stats
          title="Expenditure"
          value={totalExpenditure}
          unit="€"
          className="bg-primary"
          subtitle={currentMonthString}
        />
      </div>
      <div className="stats col-span-3">
        <Stats
          title="Number of records"
          value={numberOfRecords}
          subtitle={currentMonthString}
        />
      </div>
      <div
        className="stats card bg-primary"
        style={{ gridColumn: "7 / -1", gridRow: "1 / 1" }}
      />
      <div className="stats col-span-full">
        <Stats title="most spent on" value={mostExpenditureLabels?.label} />
        <Stats title="Amount" value={mostExpenditureLabels?.total} unit="€" />
        <Stats title="Number of records" value={mostExpenditureLabels?.count} />
      </div>
    </div>
  );
}
