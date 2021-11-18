import React from "react";
import { useMutation } from "@apollo/client";
import { faEllipsisV, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExpenditureRecord } from "@prisma/client";
import { ConfirmationModalContext } from "../../contexts/ConfirmationModalContext";
import { DELETE_EXPENDITURE_RECORD } from "../Dashboard/queries";

type Props = {
  record: ExpenditureRecord;
  refetch: () => void;
};
export default function DropdownActionMenu({ record, refetch }: Props) {
  const { requestConfirmation } = React.useContext(ConfirmationModalContext);
  const [deleteRecord] = useMutation(DELETE_EXPENDITURE_RECORD);
  const onDelete = async () => {
    await deleteRecord({ variables: { where: { id: record.id } } });
    refetch();
  };
  const requestDeleteConfirmation = () => {
    requestConfirmation({
      title: "Confirm deleting this record",
      description: `Are you sure you want to delete "${record.description}", with amount ${record.amount}€ ?`,
      onConfirm: onDelete,
    });
  };
  return (
    <div className="dropdown" onClick={(e) => e.stopPropagation()}>
      <button type="button" tabIndex={0} className="btn btn-ghost">
        <FontAwesomeIcon icon={faEllipsisV} className="w-2 h-4" />
      </button>
      <ul
        tabIndex={0}
        className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <a
            className="text-error flex gap-1 items-center"
            onClick={requestDeleteConfirmation}
          >
            <FontAwesomeIcon icon={faTrash} className="w-2 h-4" />
            Delete
          </a>
        </li>
      </ul>
    </div>
  );
}
