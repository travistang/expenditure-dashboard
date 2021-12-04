import { isValid, format } from "date-fns";

export const maybeInvalidDateToString = (
  date: any,
  formatString: string,
  stringOnInvalid = "--"
) => (isValid(date) ? format(date, formatString) : stringOnInvalid);

export const yyyyMMdd = (date: any) =>
  maybeInvalidDateToString(date, "yyyy-MM-dd");
export const yyyyMMddHHmm = (date: any) =>
  maybeInvalidDateToString(date, "yyyy-MM-dd HH:mm");
export const yyyyMMddHHmmss = (date: any) =>
  maybeInvalidDateToString(date, "yyyy-MM-dd HH:mm:ss");
