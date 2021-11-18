import { ExpenditureRecord } from "@prisma/client";

export const DEFAULT_EXPENDITURE_RECORD: ExpenditureRecord = {
  id: "",
  description: "",
  labels: [],
  date: new Date(),
  recordedAt: new Date(),
  amount: 0,
};
