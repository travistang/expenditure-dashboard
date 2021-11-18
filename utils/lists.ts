import { Reducer, ReducerAction, ReducerWithoutAction } from "react";
import { FilterValue } from "../components/Lists/SearchBar";
import { FindManyExpenditureRecordArgs } from "../prisma/generated/type-graphql";
import { toggleElements } from "./arrays";
import { caseInsensitiveMatch } from "./strings";

export const NUM_RECORDS_PER_PAGE = 15;
export const getSearchParams = (
  filterValue: FilterValue,
  page: number
): FindManyExpenditureRecordArgs => {
  const valOrUndefined = (value: any) => value ?? undefined;
  return {
    orderBy: [{ date: "desc" }],
    take: NUM_RECORDS_PER_PAGE,
    skip: NUM_RECORDS_PER_PAGE * page,
    where: {
      date: {
        gte: valOrUndefined(filterValue.earliestDate),
        lte: valOrUndefined(filterValue.latestDate),
      },
      amount: {
        gte: valOrUndefined(filterValue.minAmount),
        lte: valOrUndefined(filterValue.maxAmount),
      },
      OR: [
        {
          description: {
            mode: "insensitive",
            contains: valOrUndefined(filterValue.search),
          },
        },
        { labels: { hasEvery: filterValue.search?.split(",") ?? [] } },
      ],
    },
  };
};

export type FilterValueReducerActionType = "set" | "toggleLabel";
export type FilterValueReducerAction = {
  type: FilterValueReducerActionType;
  payload: Partial<FilterValue>;
};
export const filterReducer: Reducer<FilterValue, FilterValueReducerAction> = (
  previousFilter: FilterValue,
  action: FilterValueReducerAction
): FilterValue => {
  switch (action.type) {
    case "set":
      return { ...previousFilter, ...action.payload };
    case "toggleLabel":
      const existingSearchPhrases = previousFilter.search
        .split(",")
        .filter((s) => !!s);
      const newLabel = action.payload.search;
      if (!newLabel) {
        return previousFilter;
      }
      const newSearchPhrases = toggleElements(existingSearchPhrases, newLabel);
      return {
        ...previousFilter,
        search: newSearchPhrases.join(","),
      };
    default:
      return previousFilter;
  }
};
