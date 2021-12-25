import { Currency, ExpenditureRecord } from "@prisma/client";
import { ExpenditureRecordCreateInput } from "../../../prisma/generated/type-graphql";

export type ExpenditureInput = Omit<ExpenditureRecord, "date"> & {
  date: string;
  currencyConfig?: {
    currency: Currency;
    exchangeRate: number;
  };
};

export const expenditureValid = (expenditure: ExpenditureInput): boolean => {
  const isDateValid = !Number.isNaN(new Date(expenditure.date).getTime());
  const isLabelValid =
    Array.isArray(expenditure.labels) &&
    expenditure.labels.every((label) => typeof label === "string");
  const hasFieldMissing =
    !expenditure.date || !expenditure.description || !expenditure.id;

  return isDateValid && isLabelValid && !hasFieldMissing;
};

export const transformExpenditureInput = (
  expenditure: ExpenditureInput
): ExpenditureRecordCreateInput => {
  const { currencyConfig, labels, ...data } = expenditure;
  return {
    ...data,
    labels: { set: labels },
    currency: expenditure.currencyConfig?.currency ?? "EUR",
    exchangeRate: expenditure.currencyConfig?.exchangeRate ?? 1,
    date: new Date(expenditure.date),
    recordedAt: new Date(),
  };
};
