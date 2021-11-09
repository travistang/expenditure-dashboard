import React from "react";
import classnames from "classnames";

type Props = {
  numPages: number;
  currentPage: number;
  onGoToPage: (page: number) => void;
};
enum PagesComputationResultType {
  PAGE,
  ELLIPSIS,
}
type PagesComputationResult = {
  page?: number;
  type: PagesComputationResultType;
};
const computePagesDisplayed = (
  numPages: number,
  currentPage: number
): PagesComputationResult[] => {
  if (!(0 <= currentPage && currentPage <= numPages)) {
    return [];
  }

  const getPageRange = (start: number, end: number) =>
    Array(end - start)
      .fill(0)
      .map((_, i) => ({
        page: start + i,
        type: PagesComputationResultType.PAGE,
      }));
  const NUM_PAGES_SHOWN_ON_EDGE = 2;
  if (numPages <= 2 * NUM_PAGES_SHOWN_ON_EDGE + 1) {
    return getPageRange(0, numPages);
  }

  const requiredPages = [
    ...getPageRange(0, NUM_PAGES_SHOWN_ON_EDGE),
    ...getPageRange(
      Math.max(currentPage - 1, 0),
      Math.min(numPages, currentPage + 2)
    ),
    ...getPageRange(numPages - NUM_PAGES_SHOWN_ON_EDGE, numPages),
  ];

  return requiredPages.reduce<PagesComputationResult[]>((allPages, page) => {
    console.log({ allPages, page });
    if (!allPages.length) return [page];
    const lastPage = allPages[allPages.length - 1];
    if (
      lastPage.page < page.page - 1 &&
      lastPage.type !== PagesComputationResultType.ELLIPSIS
    )
      return [
        ...allPages,
        { page: -1, type: PagesComputationResultType.ELLIPSIS },
        page,
      ];
    if (lastPage.page === page.page - 1) {
      return [...allPages, page];
    }
    return allPages;
  }, []);
};
export default function Pagination({
  numPages,
  currentPage,
  onGoToPage,
}: Props) {
  const pages = computePagesDisplayed(numPages, currentPage);
  if (pages.length === 0) {
    return null;
  }
  return (
    <div className="btn-group">
      {currentPage > 0 && (
        <button
          className="btn btn-sm"
          onClick={() => onGoToPage(currentPage - 1)}
        >
          {"<"}
        </button>
      )}
      {pages.map(({ page, type }, index) => (
        <button
          key={`${page}-${type}-${index}`}
          className={classnames(
            "btn btn-sm",
            page === currentPage && "btn-primary"
          )}
          onClick={() =>
            type === PagesComputationResultType.ELLIPSIS
              ? undefined
              : onGoToPage(page)
          }
        >
          {type === PagesComputationResultType.ELLIPSIS ? "..." : page + 1}
        </button>
      ))}
      {currentPage < numPages - 1 && (
        <button
          className="btn btn-sm"
          onClick={() => onGoToPage(currentPage + 1)}
        >
          {">"}
        </button>
      )}
    </div>
  );
}
