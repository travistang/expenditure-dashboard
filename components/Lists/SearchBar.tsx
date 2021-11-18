import {
  faCalendar,
  faEuroSign,
  faFilter,
  faSearch,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFormik } from "formik";

export type FilterValue = {
  search: string;
  minAmount: number | null;
  maxAmount: number | null;
  earliestDate: Date | null;
  latestDate: Date | null;
};
export const DEFAULT_FILTER_VALUE: FilterValue = {
  search: "",
  minAmount: null,
  maxAmount: null,
  earliestDate: null,
  latestDate: null,
};

type Props = {
  onChange: (form: FilterValue) => void;
};
export default function SearchBar({ onChange }: Props) {
  const formik = useFormik({
    initialValues: DEFAULT_FILTER_VALUE,
    onSubmit: onChange,
  });

  const reset = () => {
    formik.resetForm();
    onChange(DEFAULT_FILTER_VALUE);
  };
  return (
    <div className="rounded-2xl bg-base-100 p-4 flex items-center w-full">
      <form
        onReset={reset}
        onSubmit={formik.handleSubmit}
        className="flex w-full flex-wrap gap-2"
      >
        <div className="w-full flex">
          <span className="px-2 bg-primary rounded-l-lg flex items-center">
            <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
          </span>
          <input
            name="search"
            value={formik.values.search}
            onChange={formik.handleChange}
            type="text"
            placeholder="labels, descriptions etc..."
            className="input input-sm flex-1 input-primary rounded-l-none border rounded-r-lg"
          />
        </div>
        <div className="w-1/3 flex">
          <span className="px-2 bg-primary rounded-l-lg flex items-center">
            <FontAwesomeIcon icon={faEuroSign} className="w-4 h-4" />
          </span>
          <input
            name="minAmount"
            value={formik.values.minAmount}
            onChange={formik.handleChange}
            type="number"
            placeholder="min"
            min={0}
            max={formik.values.maxAmount}
            step={0.01}
            className="input input-sm w-full input-primary rounded-none border"
          />
          <input
            name="maxAmount"
            value={formik.values.maxAmount}
            onChange={formik.handleChange}
            type="number"
            placeholder="max"
            min={formik.values.minAmount}
            step={0.01}
            className="input input-sm w-full input-primary rounded-l-none border"
          />
        </div>
        <div className="w-1/2 md:w-auto md:flex-1 flex">
          <span className="px-2 bg-primary rounded-l-lg flex items-center">
            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
          </span>
          <input
            name="earliestDate"
            value={
              formik.values.earliestDate
                ? formik.values.earliestDate.toString()
                : ""
            }
            onChange={formik.handleChange}
            type="date"
            placeholder="from"
            className="input input-sm flex-1 input-primary rounded-none border"
          />
          <input
            name="latestDate"
            value={
              formik.values.latestDate
                ? formik.values.latestDate.toString()
                : ""
            }
            onChange={formik.handleChange}
            type="date"
            placeholder="to"
            className="input input-sm flex-1 input-primary rounded-l-none border"
          />
        </div>
        <button
          type="reset"
          className="btn btn-sm flex items-center gap-1 flex-1 w-1/2 sm:w-16"
        >
          <FontAwesomeIcon icon={faUndo} className="w-4 h-4" />
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-sm flex items-center gap-2 flex-1 w-1/2 sm:w-16"
        >
          <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
