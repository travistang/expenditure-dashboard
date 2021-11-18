export const caseInsensitiveMatch = (a: string, b: string) =>
  a.toLowerCase() === b.toLowerCase();

export const hasPhraseMatches = (
  str: string,
  lookForString: string,
  { delimiter = ",", compareFn = caseInsensitiveMatch } = {}
) => str.split(delimiter).some((part) => compareFn(part, lookForString));
