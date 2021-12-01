import React from "react";
import { useQuery } from "@apollo/client";
import { ExpenditureRecord } from "@prisma/client";

import SearchBar, { DEFAULT_FILTER_VALUE } from "../components/Lists/SearchBar";
import Pagination from "../components/Pagination";
import AggregateResultPanel from "../components/Lists/AggregateResultPanel";
import LoadingSpinnerCover from "../components/LoadingSpinnerCover";

import { RECORD_LIST_QUERY } from "../queries/lists";
import {
  filterReducer,
  getSearchParams,
  NUM_RECORDS_PER_PAGE,
} from "../utils/lists";
import RecordsList from "../components/RecordList";

type QueryResultType = {
  expenditureRecords: ExpenditureRecord[];
  aggregateExpenditureRecord: {
    _count: { _all: number };
    _sum: { amount: number };
    _avg: { amount: number };
    _min: { amount: number };
    _max: { amount: number };
  };
};
const List: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [filter, dispatchFilter] = React.useReducer(
    filterReducer,
    DEFAULT_FILTER_VALUE
  );

  const { data, loading, refetch } = useQuery<QueryResultType>(
    RECORD_LIST_QUERY,
    {
      variables: getSearchParams(filter, currentPage),
    }
  );

  const totalNumRecords = data?.aggregateExpenditureRecord._count._all || 0;
  const numPages = Math.ceil(totalNumRecords / NUM_RECORDS_PER_PAGE);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-2 flex-wrap flex-row-reverse md:flex-nowrap md:flex-row w-full">
        <SearchBar
          onChange={(newFilter) =>
            dispatchFilter({ type: "set", payload: newFilter })
          }
        />
      </div>
      <AggregateResultPanel
        sum={data?.aggregateExpenditureRecord?._sum?.amount ?? 0}
        average={data?.aggregateExpenditureRecord?._avg?.amount ?? 0}
        min={data?.aggregateExpenditureRecord?._min?.amount ?? 0}
        max={data?.aggregateExpenditureRecord?._max?.amount ?? 0}
        count={data?.aggregateExpenditureRecord?._count?._all ?? 0}
      />
      <div className="relative flex flex-col flex-1 flex-shrink sm:flex-shrink-0 rounded-2xl w-full bg-base-100 p-4 overflow-hidden">
        {loading && <LoadingSpinnerCover dimBackground />}
        <div className="flex-1 overflow-hidden">
          <RecordsList
            headerClassName="top-14"
            records={data?.expenditureRecords ?? []}
            onChange={refetch}
            onFilterClick={(label) =>
              dispatchFilter({
                type: "toggleLabel",
                payload: { search: label },
              })
            }
            searchString={filter.search}
          />
        </div>
        <div className="flex items-center justify-end">
          <Pagination
            currentPage={currentPage}
            onGoToPage={setCurrentPage}
            numPages={numPages}
          />
        </div>
      </div>
    </div>
  );
};

export default List;
