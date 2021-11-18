import React from "react";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExpenditureRecordWithLabel } from "./types";

type Props = {
  values: ExpenditureRecordWithLabel;
  setFieldError: (field: string, errorMessage: string) => void;
  setValues: (newValue: ExpenditureRecordWithLabel) => void;
  setFieldValue: (field: string, newValue: any) => void;
  handleChange: (e: React.ChangeEvent) => void;
};
export default function LabelsInput({
  values,
  setFieldError,
  setFieldValue,
  setValues,
  handleChange,
}: Props) {
  const addLabel = () => {
    const labelInput = values.label;
    if (!labelInput) {
      setFieldError("label", "Label input cannot be empty");
      return;
    }
    if (
      values.labels.find(
        (lbl) => lbl.toLowerCase() === labelInput.toLowerCase()
      )
    ) {
      setFieldError("label", "There are labels with the same name already");
      return;
    }
    setValues({
      ...values,
      labels: [...values.labels, labelInput],
      label: "",
    });
  };

  const removeLabel = (label: string) => {
    setFieldValue(
      "labels",
      values.labels.filter((lbl) => lbl.toLowerCase() !== label.toLowerCase())
    );
  };

  const handleLabelEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue) {
      handleChange(e);
      e.target.focus();
    }
  };
  return (
    <div className="form-control col-span-full">
      <label className="label label-text">Labels</label>
      {values.labels.length > 0 && (
        <div className="max-h-48 overflow-y-auto rounded-lg w-full bg-base-200 flex items-stretch flex-col gap-1 p-2 mb-2">
          {values.labels.map((label, i) => (
            <div
              key={i}
              className="h-12 p-2 rounded-lg hover:bg-base-100 cursor-pointer flex justify-between items-center"
            >
              <input
                className="input input-ghost"
                name={`labels[${i}]`}
                value={values.labels[i]}
                onChange={handleLabelEdit}
              />

              <button
                onClick={() => removeLabel(label)}
                className="btn btn-ghost btn-error"
                type="button"
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-error w-4 h-4"
                />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          name="label"
          placeholder="Add a new label..."
          className="input border-base-content w-full"
          onChange={handleChange}
          value={values.label}
        />
        <button type="button" className="btn btn-primary" onClick={addLabel}>
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
