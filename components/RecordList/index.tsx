import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExpenditureRecord } from "@prisma/client";

import RecordDetailModal from "./RecordDetailModal";
import { DEFAULT_EXPENDITURE_RECORD } from "../../constants/lists";
import RecordListHeader from "./RecordListHeader";
import RecordListItem from "./RecordListItem";

type Props = {
  records: ExpenditureRecord[];
  onChange: () => void;
  onFilterClick?: (label: string) => void;
  searchString?: string;
  compact?: boolean;
  noCreateButton?: boolean;
  headerClassName?: string;
};
export default function RecordsList({
  records,
  onChange,
  onFilterClick,
  noCreateButton,
  searchString,
  compact,
  headerClassName,
}: Props) {
  const [selectedRecord, setSelectedRecord] =
    React.useState<ExpenditureRecord | null>(null);

  const onCreatingRecord = () => {
    setSelectedRecord(DEFAULT_EXPENDITURE_RECORD);
  };
  return (
    <>
      <RecordDetailModal
        record={selectedRecord}
        refetch={onChange}
        onClose={() => setSelectedRecord(null)}
      />
      <div className="flex flex-col flex-1 overflow-y-auto max-h-full sm:overflow-x-hidden">
        {!noCreateButton && (
          <div className="pb-2 z-10 bg-base-100 sticky top-0 flex items-center justify-end">
            <button
              type="button"
              onClick={onCreatingRecord}
              className="btn btn-primary h-auto w-full md:h-full md:w-auto flex gap-1"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              <span>Add record</span>
            </button>
          </div>
        )}
        <table className="table table-compact">
          <RecordListHeader compact={compact} className={headerClassName} />
          <tbody className="overflow-y-auto z-0">
            {records.map((record) => (
              <RecordListItem
                key={record.id}
                record={record}
                compact={compact}
                onClick={() => setSelectedRecord(record)}
                searchString={searchString}
                onFilterClick={onFilterClick}
                onDelete={onChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
