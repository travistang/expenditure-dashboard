export const toggleElements = <T>(
  array: T[],
  element: T,
  compareFn: (a: T, b: T) => boolean = (a, b) => a === b
) => {
  const isElementInArray = array.find((e) => compareFn(e, element));
  return isElementInArray
    ? array.filter((e) => !compareFn(e, element))
    : [...array, element];
};
