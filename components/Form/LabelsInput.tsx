import React from "react";
import classnames from "classnames";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExpenditureRecordWithLabel } from "../RecordList/RecordDetailModal/types";
import { FormikErrors } from "formik";

type Props<T> = {
  name: string;
  label: string;
  values: T;
  errors: FormikErrors<any>;
  setValues: (newValue: T) => void;
  setFieldValue: (field: string, newValue: any) => void;
  handleChange: (e: React.ChangeEvent) => void;
  className?: string;
};
export default function LabelsInput<T>({
  name,
  values,
  errors,
  label,
  setFieldValue,
  setValues,
  handleChange,
  className,
}: Props<T>) {
  const [labelInput, setLabelInput] = React.useState("");
  const [labelInputError, setLabelInputError] = React.useState("");
  const inputError = errors?.[name] ?? "";
  const formValue = values?.[name] ?? [];
  const addLabel = () => {
    if (!labelInput) {
      setLabelInputError("Label input cannot be empty");
      return;
    }
    if (
      formValue.find((lbl) => lbl.toLowerCase() === labelInput.toLowerCase())
    ) {
      setLabelInputError("There are labels with the same name already");
      return;
    }
    setValues({
      ...values,
      [name]: [...formValue, labelInput],
    });
    setLabelInput("");
    setLabelInputError("");
  };

  const removeLabel = (label: string) => {
    setFieldValue(
      name,
      formValue.filter((lbl) => lbl.toLowerCase() !== label.toLowerCase())
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
    <div className={classnames("form-control", className ?? "col-span-full")}>
      <label className="label label-text">{label}</label>
      {formValue.length > 0 && (
        <div className="max-h-48 overflow-y-auto rounded-lg w-full bg-base-200 flex items-stretch flex-col gap-1 p-2 mb-2">
          {formValue.map((label, i) => (
            <div
              key={i}
              className="h-12 p-2 rounded-lg hover:bg-base-100 cursor-pointer flex justify-between items-center"
            >
              <input
                className="input input-ghost"
                name={`${name}[${i}]`}
                value={formValue[i]}
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
      {inputError && (
        <span className="text-xs text-error mb-2">{inputError}</span>
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a new label..."
            className={classnames(
              "input w-full",
              !!labelInputError ? "border-error" : "border-base-content"
            )}
            onChange={(e) => setLabelInput(e.target.value)}
            value={labelInput}
          />
          <button type="button" className="btn btn-primary" onClick={addLabel}>
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          </button>
        </div>
        {labelInputError && (
          <span className="text-xs text-error">{labelInputError}</span>
        )}
      </div>
    </div>
  );
}
