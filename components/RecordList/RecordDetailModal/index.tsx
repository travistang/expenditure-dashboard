import React from "react";
import toast from "react-hot-toast";
import { useFormik, FormikErrors } from "formik";
import { ExpenditureRecord } from "@prisma/client";
import { useMutation } from "@apollo/client";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { format, isValid } from "date-fns";
import { DEFAULT_EXPENDITURE_RECORD } from "../../../constants/lists";
import { ExpenditureRecordWithLabel } from "./types";
import LabelsInput from "../../Form/LabelsInput";
import DatetimeInput from "./DatetimeInput";
import {
  CREATE_EXPENDITURE_RECORD,
  UPDATE_EXPENDITURE_RECORD,
} from "../../Dashboard/queries";
import LoadingSpinnerCover from "../../LoadingSpinnerCover";
import {
  expenditureRecordDataToUpdateData,
  expenditureRecordDataToCreateData,
} from "../../../utils/form";

const DEFAULT_FORM_VALUE: ExpenditureRecordWithLabel = {
  ...DEFAULT_EXPENDITURE_RECORD,
  label: "",
};
const validateForm = (
  record: ExpenditureRecordWithLabel
): FormikErrors<ExpenditureRecordWithLabel> => {
  const errors: FormikErrors<ExpenditureRecordWithLabel> = {};
  if (!record.description) {
    errors.description = "Description is required";
  }
  if (Number.isNaN(record.amount) || record.amount <= 0) {
    errors.amount = "Invalid amount";
  }
  if (!isValid(new Date(record.date))) {
    errors.date = "Invalid date";
  }

  if (record.labels.some((lbl) => !lbl)) {
    errors.labels = "Cannot have empty labels.";
  }

  if (
    new Set(record.labels.map((lbl) => lbl.toLowerCase())).size !==
    record.labels.length
  ) {
    errors.labels = "There are repeated labels.";
  }
  return errors;
};

type Props = {
  record: ExpenditureRecord | null;
  refetch: () => void;
  onClose: () => void;
};
export default function RecordDetailModal({ record, refetch, onClose }: Props) {
  const isCreatingRecord = !record?.id;
  const [submitForm, { loading }] = useMutation(
    isCreatingRecord ? CREATE_EXPENDITURE_RECORD : UPDATE_EXPENDITURE_RECORD
  );
  const onSubmit = async (formData: ExpenditureRecordWithLabel) => {
    const { id, label, ...data } = formData;
    try {
      await submitForm({
        variables: {
          data: !isCreatingRecord
            ? expenditureRecordDataToUpdateData({ ...data, id })
            : expenditureRecordDataToCreateData(data),
          ...(!isCreatingRecord && {
            where: {
              id,
            },
          }),
        },
      });
      refetch();
      onClose();
    } catch (error) {
      toast.error("Failed to update");
    }
  };
  const formik = useFormik({
    initialValues: DEFAULT_FORM_VALUE,
    onSubmit,
    validate: validateForm,
  });
  const hasErrors = Object.keys(formik.errors).length > 0;
  React.useEffect(() => {
    if (record) {
      const adjustedValues: ExpenditureRecordWithLabel = {
        ...record,
        label: "",
      };
      formik.setValues(adjustedValues, true);
    }
  }, [record]);

  if (!record) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="inset-0 fixed z-20 flex flex-col items-stretch justify-end md:items-center md:justify-center bg-base-300 bg-opacity-60"
    >
      <div
        className="rounded-t-2xl md:rounded-b-2xl bg-base-100 p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <LoadingSpinnerCover dimBackground className="rounded-2xl" />
        )}
        <button
          className="btn btn-ghost absolute right-4 top-4 p-1 w-8 h-8"
          onClick={onClose}
          type="button"
        >
          <FontAwesomeIcon
            icon={faTimes}
            className="w-4 h-4 text-base-content"
          />
        </button>
        <h3 className="text-lg font-bold pb-4 py-0 my-0">
          {isCreatingRecord ? "Create new record" : "Record details"}
        </h3>
        {record.recordedAt && (
          <h6 className="-mt-4 opacity-60 text-xs font-bold uppercase">
            Added at{" "}
            {format(new Date(record.recordedAt), "yyyy-MM-dd hh:mm:ss")}
          </h6>
        )}
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-12 gap-2 mt-4"
        >
          <div className="form-control col-span-5">
            <label className="label label-text">Description</label>
            <input
              name="description"
              className="input border-base-content w-full"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>
          <DatetimeInput
            setValue={(newDate) => formik.setFieldValue("date", newDate)}
            value={formik.values.date}
          />
          <LabelsInput
            name="labels"
            label="Labels"
            errors={formik.errors}
            values={formik.values}
            handleChange={formik.handleChange}
            setFieldValue={formik.setFieldValue}
            setValues={formik.setValues}
          />
          <div className="form-control col-span-5">
            <label className="label label-text">Amount</label>
            <input
              type="number"
              name="amount"
              className="input bg-accent bg-opacity-70 w-full"
              onChange={formik.handleChange}
              value={formik.values.amount}
              step={0.01}
            />
          </div>
          <div className="col-span-full flex items-center gap-2 mt-2 justify-end">
            <button className="gap-2 btn" type="button" onClick={onClose}>
              <FontAwesomeIcon className="w-4 h-4" icon={faTimes} />
              Cancel
            </button>
            <button
              className={classnames(
                "gap-2 btn btn-primary",
                hasErrors && "btn-disabled cursor-not-allowed"
              )}
              type="submit"
            >
              <FontAwesomeIcon className="w-4 h-4" icon={faCheckCircle} />
              {isCreatingRecord ? "Create" : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
