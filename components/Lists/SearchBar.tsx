import {
  faCalendar,
  faEuroSign,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { format } from "date-fns";
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

  return (
    <div className="rounded-lg h-12 bg-base-100 p-4 flex items-center w-full">
      <form onSubmit={formik.handleSubmit} className="flex gap-2">
        <div className="flex flex-1">
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
        <div className="flex">
          <span className="px-2 bg-primary rounded-l-lg flex items-center">
            <FontAwesomeIcon icon={faEuroSign} className="w-4 h-4" />
          </span>
          <input
            name="minAmount"
            value={formik.values.minAmount}
            onChange={formik.handleChange}
            type="number"
            placeholder="min"
            className="input input-sm w-20 input-primary rounded-none border"
          />
          <input
            name="maxAmount"
            value={formik.values.maxAmount}
            onChange={formik.handleChange}
            type="number"
            placeholder="max"
            className="input input-sm w-20 input-primary rounded-l-none border"
          />
        </div>
        <div className="flex">
          <span className="px-2 bg-primary rounded-l-lg flex items-center">
            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
          </span>
          <input
            name="earliestDate"
            value={
              formik.values.earliestDate
                ? format(formik.values.earliestDate, "dd/MM/yyyy")
                : ""
            }
            onChange={formik.handleChange}
            type="date"
            placeholder="from"
            className="input input-sm input-primary rounded-none border"
          />
          <input
            name="latestDate"
            value={
              formik.values.earliestDate
                ? format(formik.values.earliestDate, "dd/MM/yyyy")
                : ""
            }
            onChange={formik.handleChange}
            type="date"
            placeholder="to"
            className="input input-sm input-primary rounded-l-none border"
          />
        </div>
      </form>
    </div>
  );
}
