import { ExpenditureRecord } from "@prisma/client";

export type ExpenditureRecordWithLabel = ExpenditureRecord & {
  label: string;
};
