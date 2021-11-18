import { gql } from "@apollo/client";

export const RECORD_LIST_QUERY = gql`
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
