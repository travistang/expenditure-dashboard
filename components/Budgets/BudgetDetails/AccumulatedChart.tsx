import { ExpenditureRecord } from "@prisma/client";
import { ResponsiveLine } from "@nivo/line";
import { accumulatedExpenditureOfEachDay } from "../../../domain/expenditureOfDays";
import withWidgetShell from "./WidgetShell";
import { format } from "date-fns";
type Props = {
  records: ExpenditureRecord[];
  budgetAmount: number;
  fromDate: Date;
  toDate: Date;
};
function AccumulatedChart({ records, budgetAmount, fromDate, toDate }: Props) {
  const accumulatedExpenditures = accumulatedExpenditureOfEachDay({
    fromDate,
    toDate,
    records,
  });
  const data = [
    {
      id: "Accumulated expenditure",
      color: "rgb(255, 255, 255)",
      data: Object.entries(accumulatedExpenditures).map(([date, amount]) => ({
        x: format(new Date(date), "MMM dd"),
        y: amount,
      })),
    },
    {
      id: "Budget limit",
      color: "rgb(255, 0, 0)",
      data: Object.keys(accumulatedExpenditures).map((date) => ({
        x: format(new Date(date), "MMM dd"),
        y: budgetAmount,
      })),
    },
  ];
  return (
    <>
      <span className="stat-title pb-4">Accumulated Expenditure</span>
      <ResponsiveLine
        data={data}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        curve="basis"
        isInteractive
        lineWidth={6}
        useMesh
        axisBottom={{ tickRotation: -45, legend: "Date" }}
        margin={{ top: 12, bottom: 64, left: 48, right: 36 }}
      />
    </>
  );
}

export default withWidgetShell(AccumulatedChart);
