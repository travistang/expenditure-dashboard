import { gql } from "@apollo/client";

export const EXPENDITURE_OF_MONTH = gql`
  query expenditureRecordOfTheMonth(
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    expenditureRecords(where: { date: { gte: $startDate, lte: $endDate } }) {
      id
      date
      recordedAt
      description
      labels
      amount
    }
  }
`;
