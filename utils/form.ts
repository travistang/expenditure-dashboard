import { ExpenditureRecord } from "@prisma/client";
import {
  ExpenditureRecordCreateInput,
  ExpenditureRecordUpdateInput,
} from "../prisma/generated/type-graphql";

export const expenditureRecordDataToUpdateData = (
  data: ExpenditureRecord
): ExpenditureRecordUpdateInput => {
  return {
    description: data.description ? { set: data.description } : {},
    labels: data.labels ? { set: data.labels } : {},
    amount: data.amount ? { set: data.amount } : {},
    date: data.date ? { set: new Date(data.date) } : {},
  };
};

export const expenditureRecordDataToCreateData = (
  data: Omit<ExpenditureRecord, "id">
): ExpenditureRecordCreateInput => {
  return {
    ...data,
    labels: { set: data.labels },
    id: `${Math.random().toString().slice(2)}-${new Date().getTime()}`,
  };
};
