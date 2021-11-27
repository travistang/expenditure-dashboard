import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@apollo/client";
import { ExpenditureRecord } from "@prisma/client";

import SearchBar, { DEFAULT_FILTER_VALUE } from "../components/Lists/SearchBar";
import Pagination from "../components/Pagination";
import AggregateResultPanel from "../components/Lists/AggregateResultPanel";
import RecordDetailModal from "../components/Lists/RecordDetailModal";
import DropdownActionMenu from "../components/Lists/DropdownActionMenu";
import LoadingSpinnerCover from "../components/LoadingSpinnerCover";
import LabelTag from "../components/Lists/LabelTag";

import { RECORD_LIST_QUERY } from "../queries/lists";
import { DEFAULT_EXPENDITURE_RECORD } from "../constants/lists";
import {
  filterReducer,
  getSearchParams,
  NUM_RECORDS_PER_PAGE,
} from "../utils/lists";
import { maybeInvalidDateToString } from "../utils/dates";

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

  const [selectedRecord, setSelectedRecord] =
    React.useState<ExpenditureRecord | null>(null);

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

  const onStartCreatingRecord = () => {
    setSelectedRecord(DEFAULT_EXPENDITURE_RECORD);
  };
  return (
    <div className="flex flex-col h-full gap-4">
      <RecordDetailModal
        record={selectedRecord}
        refetch={refetch}
        onClose={() => setSelectedRecord(null)}
      />
      <div className="flex items-center gap-2 flex-wrap flex-row-reverse md:flex-nowrap md:flex-row w-full">
        <SearchBar
          onChange={(newFilter) =>
            dispatchFilter({ type: "set", payload: newFilter })
          }
        />
        <button
          type="button"
          onClick={onStartCreatingRecord}
          className="btn btn-primary h-auto w-full md:h-full md:w-auto flex gap-1"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span>Create</span>
        </button>
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <table className="table w-full table-compact">
            <thead>
              <tr>
                <th className="sticky top-0 z-0">Date</th>
                <th className="sticky top-0 z-0">Description</th>
                <th className="sticky top-0 z-0">Labels</th>
                <th className="sticky top-0 z-0">Expenditure</th>
                <th className="sticky top-0 z-0" />
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {data?.expenditureRecords.map((record) => (
                <tr
                  onClick={() => setSelectedRecord(record)}
                  key={record.id}
                  className="cursor-pointer hover:bg-primary-focus"
                >
                  <td>
                    {maybeInvalidDateToString(
                      new Date(record.date),
                      "dd.MM.yy HH:mm"
                    )}
                  </td>
                  <td>{record.description}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(record.labels)
                        .sort()
                        .map((label) => (
                          <LabelTag
                            label={label}
                            dispatchFilter={dispatchFilter}
                            searchString={filter.search}
                            key={label}
                          />
                        ))}
                    </div>
                  </td>
                  <td>{record.amount.toFixed(2)}€</td>
                  <td>
                    <DropdownActionMenu record={record} refetch={refetch} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
