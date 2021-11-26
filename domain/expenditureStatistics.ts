import { ExpenditureRecord } from "@prisma/client";

export const total = (records: ExpenditureRecord[]) =>
  records.reduce((total, record) => total + record.amount, 0);

export const count = (records: ExpenditureRecord[]) => records.length;
export const average = (records: ExpenditureRecord[]) =>
  total(records) / (count(records) || 1);
export const max = (records: ExpenditureRecord[]) =>
  records.reduce(
    (max, record) => (max < record.amount ? record.amount : max),
    0
  );
export const min = (records: ExpenditureRecord[]) =>
  records.reduce(
    (min, record) => (min > record.amount ? record.amount : min),
    0
  );
