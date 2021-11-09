import { isValid, format } from "date-fns";

export const maybeInvalidDateToString = (
  date: any,
  formatString: string,
  stringOnInvalid = "--"
) => (isValid(date) ? format(date, formatString) : stringOnInvalid);
