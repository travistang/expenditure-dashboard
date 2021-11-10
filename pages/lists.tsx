import React from "react";
import classnames from "classnames";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useQuery } from "@apollo/client";
import { ExpenditureRecord } from "@prisma/client";
import SearchBar, {
  DEFAULT_FILTER_VALUE,
  FilterValue,
} from "../components/Lists/SearchBar";
import { FindManyExpenditureRecordArgs } from "../prisma/generated/type-graphql";
import { maybeInvalidDateToString } from "../utils/dates";
import Pagination from "../components/Pagination";
import AggregateResultPanel from "../components/Lists/AggregateResultPanel";

const NUM_RECORDS_PER_PAGE = 15;
const getSearchParams = (
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
  const query = gql`
    query expenditureRecordList(
      $where: ExpenditureRecordWhereInput!
      $orderBy: [ExpenditureRecordOrderByInput!]
      $take: Int!
      $skip: Int!
    ) {
      expenditureRecords(
        where: $where
        orderBy: $orderBy
        take: $take
        skip: $skip
      ) {
        id
        date
        recordedAt
        description
        labels
        amount
      }
      aggregateExpenditureRecord(where: $where) {
        _sum {
          amount
        }
        _min {
          amount
        }
        _max {
          amount
        }
        _avg {
          amount
        }
        _count {
          _all
        }
      }
    }
  `;
  const [currentPage, setCurrentPage] = React.useState(0);
  const [filter, setFilter] = React.useState(DEFAULT_FILTER_VALUE);
  const { data, error, loading } = useQuery<QueryResultType>(query, {
    variables: getSearchParams(filter, currentPage),
  });
  console.log({ filter, data });

  const totalNumRecords = data?.aggregateExpenditureRecord._count._all || 0;
  const numPages = Math.ceil(totalNumRecords / NUM_RECORDS_PER_PAGE);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-2 w-full">
        <SearchBar onChange={setFilter} />
        <button className="btn btn-primary h-full flex gap-1">
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
      <div className="relative flex flex-col flex-1 flex-shrink-0 rounded-lg w-full bg-base-100 p-4 overflow-hidden">
        {loading && (
          <div className="absolute w-48 h-48 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin transform"
            />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <table className="table w-full table-compact overflow-y-auto">
            <thead>
              <tr>
                <th className="sticky top-0">Date</th>
                <th className="sticky top-0">Description</th>
                <th className="sticky top-0">Labels</th>
                <th className="sticky top-0">Expenditure</th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {data?.expenditureRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    {maybeInvalidDateToString(
                      new Date(record.date),
                      "dd.MM.yy HH:mm"
                    )}
                  </td>
                  <td>{record.description}</td>
                  <td className="flex flex-wrap gap-1">
                    {Array.from(record.labels)
                      .sort()
                      .map((label) => (
                        <span
                          className={classnames(
                            "badge",
                            filter.search
                              .toLowerCase()
                              .includes(label.toLowerCase()) && "badge-primary"
                          )}
                          key={label}
                        >
                          {label}
                        </span>
                      ))}
                  </td>
                  <td>{record.amount.toFixed(2)}€</td>
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
