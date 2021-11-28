import { ExpenditureRecord } from "@prisma/client";
import RecordsList from "../../RecordList";
import withWidgetShell from "./WidgetShell";

type Props = {
  records: ExpenditureRecord[];
  refetch: () => void;
};
function BudgetRecordsList({ records, refetch }: Props) {
  return (
    <>
      <span className="stat-title pb-4">Records under budget</span>
      <RecordsList
        headerClassName="top-0"
        onChange={refetch}
        compact
        noCreateButton
        records={records}
      />
    </>
  );
}

export default withWidgetShell(BudgetRecordsList);
