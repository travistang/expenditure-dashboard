import { ExpenditureRecord } from "@prisma/client";
import Stats, { Props as StatsProps } from "./Stats";

type Props = Omit<StatsProps, "value"> & {
  records: ExpenditureRecord[];
  aggregationFunc: (expenditureRecords: ExpenditureRecord[]) => number;
};

export default function CommonExpenditureWidget({
  aggregationFunc,
  records,
  ...props
}: Props) {
  const value = aggregationFunc(records);
  return <Stats {...props} value={value} />;
}
