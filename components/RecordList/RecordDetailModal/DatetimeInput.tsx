import React from "react";
import { format, isValid, parse } from "date-fns";

type Props = {
  setValue: (newValue: Date) => void;
  value: Date;
};
export default function DatetimeInput({ setValue, value }: Props) {
  const useValue = isValid(new Date(value)) ? new Date(value) : new Date();
  const setValueWithValidation = (date: Date) => {
    if (!isValid(date)) return;
    setValue(date);
  };
  const onDateChange = (newDate: string) => {
    const newValue = new Date(value);
    const inputDate = new Date(newDate);
    newValue.setFullYear(inputDate.getFullYear());
    newValue.setMonth(inputDate.getMonth());
    newValue.setDate(inputDate.getDate());
    setValueWithValidation(newValue);
  };
  const onTimeChange = (newTime: string) => {
    const newValue = new Date(value);
    const inputDate = parse(newTime, "HH:mm", new Date());
    newValue.setHours(inputDate.getHours());
    newValue.setMinutes(inputDate.getMinutes());
    setValueWithValidation(newValue);
  };
  return (
    <>
      <div className="form-control col-span-4">
        <label className="label label-text">Date</label>
        <input
          type="date"
          className="input border-base-content w-full"
          onChange={(e) => onDateChange(e.target.value)}
          value={format(useValue, "yyyy-MM-dd")}
        />
      </div>
      <div className="form-control col-span-3">
        <label className="label label-text">Time</label>
        <input
          type="time"
          className="input border-base-content w-full"
          onChange={(e) => onTimeChange(e.target.value)}
          value={format(useValue, "HH:mm")}
        />
      </div>
    </>
  );
}
