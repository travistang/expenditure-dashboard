import { ExpenditureRecord } from "@prisma/client";
import React from "react";
import { maybeInvalidDateToString } from "../../utils/dates";
import DropdownActionMenu from "./DropdownActionMenu";
import LabelTag from "./LabelTag";

type Props = {
  onClick: () => void;
  record: ExpenditureRecord;
  compact?: boolean;
  onFilterClick?: (label: string) => void;
  searchString?: string;
  onDelete: () => void;
};

export default function RecordListItem({
  record,
  onClick,
  compact,
  searchString,
  onFilterClick,
  onDelete,
}: Props) {
  return (
    <tr
      onClick={onClick}
      className="hover cursor-pointer hover:bg-primary-focus"
    >
      <td>
        {maybeInvalidDateToString(new Date(record.date), "dd.MM.yy HH:mm")}
      </td>
      <td>{record.description}</td>
      {!compact && (
        <td>
          <div className="flex flex-wrap gap-1">
            {Array.from(record.labels)
              .sort()
              .map((label) => (
                <LabelTag
                  label={label}
                  onClick={() => onFilterClick?.(label)}
                  searchString={searchString ?? ""}
                  key={label}
                />
              ))}
          </div>
        </td>
      )}
      <td>{record.amount.toFixed(2)}€</td>
      {!compact && (
        <td>
          <DropdownActionMenu record={record} refetch={onDelete} />
        </td>
      )}
    </tr>
  );
}
