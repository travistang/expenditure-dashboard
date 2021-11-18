import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ConfirmationModalContext } from "../contexts/ConfirmationModalContext";

export default function ConfirmationModal() {
  const { title, description, opened, onConfirm, onClose } = React.useContext(
    ConfirmationModalContext
  );
  if (!opened) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-base-300 bg-opacity-50">
      <div className="modal-box rounded-2xl bg-base-100 p-4 z-40 gap-2 relative flex flex-col items-stretch justify-center">
        <h2 className="font-bold text-xl p-0 m-0">{title}</h2>
        <h5 className="font-bold p-0 m-0">{description}</h5>
        <div className="flex items-center gap-2 justify-end">
          <button type="button" className="btn  btn-base" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            Cancel
          </button>
          <button type="button" className="btn  btn-error" onClick={onConfirm}>
            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
