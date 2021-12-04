import logger from "../logger";

export const caseInsensitiveMatch = (a: string, b: string) =>
  a.toLowerCase() === b.toLowerCase();

export const hasPhraseMatches = (
  str: string,
  lookForString: string,
  { delimiter = ",", compareFn = caseInsensitiveMatch } = {}
) => str.split(delimiter).some((part) => compareFn(part, lookForString));

export const safeParseJSON = (str: string): any => {
  const charTransformMap = {
    "“": '"',
    "”": '"',
  };

  const sanitizedString = Object.entries(charTransformMap).reduce(
    (finalStr, [from, to]) => finalStr.replace(new RegExp(from, "g"), to),
    str
  );

  try {
    logger.warn(JSON.stringify({ sanitizedString }));
    return JSON.parse(sanitizedString);
  } catch (e) {
    return null;
  }
};
