import { ExpenditureRecord } from "@prisma/client";
import {
  addDays,
  differenceInDays,
  format,
  isBefore,
  isSameDay,
} from "date-fns";
import { total } from "./expenditureStatistics";

export type ExpenditureOfEachDayProps = {
  fromDate: Date;
  toDate: Date;
  records: ExpenditureRecord[];
};
export type EachDayData = {
  amount: number;
  records: ExpenditureRecord[];
};
export const expenditureOfEachDay = ({
  fromDate,
  toDate,
  records,
}: ExpenditureOfEachDayProps): Record<string, EachDayData> => {
  if (isBefore(toDate, fromDate)) {
    return expenditureOfEachDay({
      fromDate: toDate,
      toDate: fromDate,
      records,
    });
  }
  const numDaysBetween = differenceInDays(toDate, fromDate);
  if (numDaysBetween <= 1) {
    return {};
  }
  const rangeN = Array(numDaysBetween)
    .fill(1)
    .map((_, i) => i);
  return rangeN.reduce((result, df) => {
    const dayOfInterest = addDays(fromDate, df);
    const recordsOfThatDay = records.filter((record) =>
      isSameDay(new Date(record.date), dayOfInterest)
    );
    return {
      ...result,
      [format(dayOfInterest, "yyyy-MM-dd")]: {
        records: recordsOfThatDay,
        amount: total(recordsOfThatDay),
      },
    };
  }, {});
};

export const accumulatedExpenditureOfEachDay = ({
  fromDate,
  toDate,
  records,
}: ExpenditureOfEachDayProps): Record<string, number> => {
  const eachDayRecords = expenditureOfEachDay({ fromDate, toDate, records });
  const eachDayRecordsSortedEntries = Object.entries(eachDayRecords).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()
  );
  const accumulatedEntries = eachDayRecordsSortedEntries.reduce(
    (entries, [date, data]) => {
      if (entries.length === 0) return [[date, data.amount]];
      const previousEntry = entries[entries.length - 1];
      return [...entries, [date, data.amount + previousEntry[1]]];
    },
    []
  );
  return Object.fromEntries(accumulatedEntries);
};
